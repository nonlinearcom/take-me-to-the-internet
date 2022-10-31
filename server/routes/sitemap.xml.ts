import { serverQueryContent } from '#content/server'
import { SitemapStream, streamToPromise } from 'sitemap'

export default defineEventHandler(async (event) => {
	// Fetch all documents
	const docs = await serverQueryContent(event).find()
	const sitemap = new SitemapStream({
		hostname: 'https://take-me-to-the-internet.com'
	})
	for (const doc of docs) {

		sitemap.write({
			// slug temp fix
			// url: doc._path,
			url: doc.slug,
			changefreq: 'monthly'
		})
	}
	sitemap.end()

	return streamToPromise(sitemap)
})
