import { readItems } from '@directus/sdk'

export type SearchGroup = 'articles' | 'glossary' | 'resources' | 'log'

export interface SearchEntry {
  group: SearchGroup
  title: string
  subtitle?: string
  body: string
  url: string
  // Pre-normalized haystacks (lowercase, diacritics stripped)
  nTitle: string
  nSubtitle: string
  nMeta: string
  nBody: string
}

export interface SearchSnippet {
  before: string
  match: string
  after: string
}

export interface SearchResult {
  entry: SearchEntry
  score: number
  snippet: SearchSnippet | null
}

export const SEARCH_GROUPS: SearchGroup[] = ['articles', 'glossary', 'resources', 'log']

const BODY_LIMIT = 3000
const MAX_PER_GROUP = 8

function normalizeText(input: string) {
  return input.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

function stripHtml(html?: string | null) {
  if (!html)
    return ''
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function makeEntry(input: {
  group: SearchGroup
  title: string
  subtitle?: string | null
  meta?: string
  body?: string
  url: string
}): SearchEntry {
  const body = (input.body ?? '').slice(0, BODY_LIMIT)
  return {
    group: input.group,
    title: input.title,
    subtitle: input.subtitle ?? undefined,
    body,
    url: input.url,
    nTitle: normalizeText(input.title),
    nSubtitle: normalizeText(input.subtitle ?? ''),
    nMeta: normalizeText(input.meta ?? ''),
    nBody: normalizeText(body),
  }
}

// Snippets are matched on plain lowercase (no diacritic stripping) so the
// indices map back onto the original body; accented-only matches simply get no snippet.
function makeSnippet(body: string, terms: string[]): SearchSnippet | null {
  const lower = body.toLowerCase()
  for (const term of terms) {
    const index = lower.indexOf(term)
    if (index === -1)
      continue
    const start = Math.max(0, index - 40)
    const end = Math.min(body.length, index + term.length + 60)
    return {
      before: (start > 0 ? '…' : '') + body.slice(start, index),
      match: body.slice(index, index + term.length),
      after: body.slice(index + term.length, end) + (end < body.length ? '…' : ''),
    }
  }
  return null
}

export function useSearch() {
  const { $directus } = useNuxtApp()
  const languageCode = useLanguageCode()

  const isSearchOpen = useState('search-open', () => false)
  const query = useState('search-query', () => '')
  const queryDebounced = refDebounced(query, 200)

  async function buildIndex(): Promise<SearchEntry[]> {
    const translationsDeep = {
      translations: {
        _filter: {
          languages_code: { _eq: languageCode.value },
        },
      },
    }

    const [pages, glossary, resources, log] = await Promise.all([
      $directus.request<Page[]>(readItems('pages', {
        filter: { status: { _eq: 'published' } },
        fields: ['slug', { translations: ['title', 'content'] }],
        deep: translationsDeep,
        limit: -1,
      })),
      $directus.request<GlossaryItem[]>(readItems('glossary', {
        filter: { status: { _eq: 'published' } },
        fields: ['slug', { translations: ['term', 'description'] }],
        deep: translationsDeep,
        limit: -1,
      })),
      $directus.request<Resource[]>(readItems('resources', {
        filter: { status: { _neq: 'draft' } },
        fields: [
          'slug',
          'title',
          'subtitle',
          'description',
          'type',
          'year',
          'people.people_id.name',
          'tags.tags_id.title',
          'topics.topics_id.title',
        ],
        limit: -1,
      })),
      // Only published: archived log entries are listed on /log but deliberately
      // not clickable, so search must not deep-link into them either.
      $directus.request<any[]>(readItems('log', {
        filter: { status: { _eq: 'published' } },
        fields: ['slug', 'title', 'subtitle', 'institution', 'role', 'type', 'location', 'year', 'content'],
        limit: -1,
      })),
    ])

    const entries: SearchEntry[] = []

    for (const page of pages) {
      const translation = page.translations?.[0]
      if (!translation?.title)
        continue
      entries.push(makeEntry({
        group: 'articles',
        title: translation.title,
        body: translation.content ? generateText(translation.content) : '',
        url: STATIC_PAGE_SLUGS.includes(page.slug) ? `/${page.slug}` : `/articles/${page.slug}`,
      }))
    }

    for (const item of glossary) {
      const translation = item.translations?.[0]
      if (!translation?.term)
        continue
      entries.push(makeEntry({
        group: 'glossary',
        title: translation.term,
        body: translation.description ? generateText(translation.description) : '',
        url: `/glossary/${item.slug}`,
      }))
    }

    for (const resource of resources) {
      if (!resource.slug)
        continue
      entries.push(makeEntry({
        group: 'resources',
        title: resource.title,
        subtitle: resource.subtitle,
        meta: [
          resource.type,
          resource.year,
          ...(resource.people?.map(({ people_id }) => people_id?.name) ?? []),
          ...(resource.tags?.map(({ tags_id }) => tags_id?.title) ?? []),
          ...(resource.topics?.map(({ topics_id }) => topics_id?.title) ?? []),
        ].filter(Boolean).join(' '),
        body: stripHtml(resource.description),
        url: `/resources/${resource.slug}`,
      }))
    }

    for (const entry of log) {
      entries.push(makeEntry({
        group: 'log',
        title: entry.title,
        subtitle: entry.subtitle,
        meta: [entry.role, entry.institution, entry.type, entry.location, entry.year].filter(Boolean).join(' '),
        body: entry.content ? generateText(entry.content) : '',
        url: `/log/${entry.slug}`,
      }))
    }

    return entries
  }

  const { data: index, status: indexStatus, execute, refresh } = useAsyncData(
    'search-index',
    buildIndex,
    { immediate: false, server: false },
  )

  function ensureIndex() {
    if (indexStatus.value === 'idle')
      execute()
  }

  function refreshIndex() {
    if (indexStatus.value !== 'idle')
      refresh()
  }

  const results = computed<SearchResult[]>(() => {
    const q = normalizeText(queryDebounced.value.trim())
    if (q.length < 2 || !index.value)
      return []
    const terms = q.split(/\s+/).filter(Boolean)
    const rawTerms = queryDebounced.value.trim().toLowerCase().split(/\s+/).filter(Boolean)

    const matches: SearchResult[] = []
    for (const entry of index.value) {
      let score = 0
      let matchedAll = true
      for (const term of terms) {
        let termScore = 0
        if (entry.nTitle.startsWith(term))
          termScore = 8
        else if (entry.nTitle.includes(term))
          termScore = 5
        else if (entry.nSubtitle.includes(term) || entry.nMeta.includes(term))
          termScore = 3
        else if (entry.nBody.includes(term))
          termScore = 1

        if (termScore === 0) {
          matchedAll = false
          break
        }
        score += termScore
      }
      if (matchedAll)
        matches.push({ entry, score, snippet: makeSnippet(entry.body, rawTerms) })
    }

    return matches.sort((a, b) => b.score - a.score)
  })

  const groupedResults = computed(() => {
    return SEARCH_GROUPS
      .map(group => ({
        group,
        results: results.value.filter(({ entry }) => entry.group === group).slice(0, MAX_PER_GROUP),
      }))
      .filter(({ results: groupResults }) => groupResults.length > 0)
  })

  return {
    isSearchOpen,
    query,
    queryDebounced,
    indexStatus,
    ensureIndex,
    refreshIndex,
    groupedResults,
  }
}
