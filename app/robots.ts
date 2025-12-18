export default function robots() {
  const baseUrl = 'https://tech-knowlogia.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin-dashboard', '/admin-dashboard/*', '/admin', '/api/'],
      },
      {
        userAgent: 'Googlebot-News',
        allow: '/',
        disallow: ['/admin-dashboard', '/admin', '/api/'],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/news-sitemap.xml`,
    ],
    host: baseUrl,
  }
}
