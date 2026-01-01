import { BetaAnalyticsDataClient } from '@google-analytics/data'

export type Ga4TopPageRow = {
  path: string
  views: number
  users: number
}

export type Ga4Summary = {
  range: '7d' | '30d'
  totalViews: number
  totalUsers: number
  topPages: Ga4TopPageRow[]
  lastUpdated: string
}

let cachedClient: BetaAnalyticsDataClient | null = null

function loadCredentials(): Record<string, unknown> | null {
  const b64 = process.env.GOOGLE_ANALYTICS_CREDENTIALS_B64
  if (b64) {
    try {
      const json = Buffer.from(b64, 'base64').toString('utf8')
      const parsed = JSON.parse(json) as unknown
      const record = parsed as Record<string, unknown>
      const clientEmail = record?.client_email
      const privateKeyRaw = record?.private_key

      if (typeof clientEmail !== 'string' || clientEmail.length === 0) return null
      if (typeof privateKeyRaw !== 'string' || privateKeyRaw.length === 0) return null

      const privateKey = privateKeyRaw.replace(/\\n/g, '\n')

      return {
        client_email: clientEmail,
        private_key: privateKey,
      }
    } catch {
      return null
    }
  }

  const clientEmail = process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_ANALYTICS_PRIVATE_KEY

  if (!clientEmail || !privateKey) return null

  // Netlify env vars often store \n-escaped private keys.
  return {
    client_email: clientEmail,
    private_key: privateKey.replace(/\\n/g, '\n'),
  }
}

export function isGa4Configured(): boolean {
  const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID
  if (!propertyId) return false
  return loadCredentials() !== null
}

export function getGa4Client(): BetaAnalyticsDataClient {
  if (cachedClient) return cachedClient

  const credentials = loadCredentials()
  if (!credentials) {
    throw new Error('GA4 credentials are not configured')
  }

  cachedClient = new BetaAnalyticsDataClient({ credentials })
  return cachedClient
}

export async function fetchGa4Summary(range: '7d' | '30d' = '30d'): Promise<Ga4Summary> {
  const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID
  if (!propertyId) {
    throw new Error('GOOGLE_ANALYTICS_PROPERTY_ID is not configured')
  }

  const client = getGa4Client()

  const dateRanges =
    range === '7d'
      ? [{ startDate: '7daysAgo', endDate: 'today' }]
      : [{ startDate: '30daysAgo', endDate: 'today' }]

  const [report] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges,
    metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }],
    dimensions: [{ name: 'pagePath' }],
    limit: 20,
    orderBys: [
      {
        metric: {
          metricName: 'screenPageViews',
        },
        desc: true,
      },
    ],
  })

  const topPages: Ga4TopPageRow[] = (report.rows || []).map((row) => {
    const path = row.dimensionValues?.[0]?.value || ''
    const views = Number(row.metricValues?.[0]?.value || 0)
    const users = Number(row.metricValues?.[1]?.value || 0)
    return { path, views, users }
  })

  const totalViews = Number(report.totals?.[0]?.metricValues?.[0]?.value || 0)
  const totalUsers = Number(report.totals?.[0]?.metricValues?.[1]?.value || 0)

  return {
    range,
    totalViews,
    totalUsers,
    topPages,
    lastUpdated: new Date().toISOString(),
  }
}
