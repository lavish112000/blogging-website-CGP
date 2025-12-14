import { getAllPosts } from '@/lib/mdx'

const SITE_URL = 'https://tech-knowlogia.com'

export async function GET() {
  const posts = await getAllPosts()

  const now = new Date()
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000

  const recentPosts = posts.filter((post) => {
    const date = new Date(post.date)
    return now.getTime() - date.getTime() <= thirtyDaysMs
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${recentPosts
    .map((post) => {
      const loc = `${SITE_URL}/${post.category}/${post.slug}`
      const pubDate = new Date(post.date).toISOString()
      const title = post.title.replace(/&/g, '&amp;')

      return `
  <url>
    <loc>${loc}</loc>
    <news:news>
      <news:publication>
        <news:name>Tech-Knowlogia</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title><![CDATA[${title}]]></news:title>
    </news:news>
  </url>`
    })
    .join('')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=300, stale-while-revalidate',
    },
  })
}
