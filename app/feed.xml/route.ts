import { getAllPosts } from '@/lib/mdx'

const SITE_URL = 'https://tech-knowlogia.com'

export async function GET() {
  const posts = await getAllPosts()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Tech-Knowlogia</title>
    <link>${SITE_URL}</link>
    <description>Premium Knowledge for Modern Professionals</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map((post) => {
        return `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${SITE_URL}/${post.category}/${post.slug}</link>
        <guid isPermaLink="true">${SITE_URL}/${post.category}/${post.slug}</guid>
        <description><![CDATA[${post.description}]]></description>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <category>${post.category}</category>
      </item>`
      })
      .join('')}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
