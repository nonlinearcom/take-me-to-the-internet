# Take me to the internet

Frontend for [take-me-to-the-internet.com](https://www.take-me-to-the-internet.com) — a
[Nuxt](https://nuxt.com) application that renders content from a [Directus](https://directus.io)
CMS, with interactive [cables.gl](https://cables.gl) WebGL patches.

## Stack

- **Nuxt 4** (Vue 3) with a layered structure — see [`layers/`](layers/) for the UI kit and flexible editor
- **Directus** as the headless CMS / asset backend (`@directus/sdk`)
- **TipTap** for rendering rich-text content
- **i18n** (English / Italian)
- **cables.gl** patches under [`public/patches/`](public/patches/) for the WebGL cover visuals

## Setup

Requires [pnpm](https://pnpm.io).

```bash
pnpm install
cp .env.example .env   # then edit values
```

### Environment

| Variable                   | Description                                                                                                                                  |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `NUXT_PUBLIC_SITE_URL`     | Canonical URL of this site (sitemap, canonicals, hreflang, absolute `og:image`). Needed at build time too, see `.env.example`.               |
| `NUXT_PUBLIC_DIRECTUS_URL` | URL of the Directus backend (content + assets). Read at runtime, so changing it does not require a rebuild.                                  |
| `NUXT_DIRECTUS_URL`        | Optional server-only Directus URL (e.g. an internal Docker hostname). Used for SSR content fetches and the `/assets/**` proxy when set.      |

Images are served from this site's own domain: `/assets/**` is proxied to Directus by [`server/routes/assets/[...path].ts`](server/routes/assets/%5B...path%5D.ts), so image URLs never carry the backend host.

## Development

```bash
pnpm dev      # start dev server on http://localhost:3000
pnpm lint     # eslint
pnpm lint:fix # eslint --fix
```

## Production

```bash
pnpm build              # build
node .output/server/index.mjs   # or: pnpm start
pnpm preview            # preview the production build locally
```

## License

[MIT](LICENSE)
