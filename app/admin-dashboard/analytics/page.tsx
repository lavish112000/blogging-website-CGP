'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Eye, BarChart3, RefreshCw } from 'lucide-react'

type Ga4TopPageRow = {
  path: string
  views: number
  users: number
}

type Ga4Summary = {
  range: '7d' | '30d'
  totalViews: number
  totalUsers: number
  topPages: Ga4TopPageRow[]
  lastUpdated: string
}

type Ga4ApiResponse =
  | { configured: false }
  | { configured: true; summary: Ga4Summary }
  | { error: string; reason?: string }

async function getIdentityAccessToken(): Promise<string | null> {
  try {
    const identity = (window as any)?.netlifyIdentity
    const user = identity?.currentUser?.()
    const direct = user?.token?.access_token
    if (direct) return direct

    // More reliable: Netlify Identity user objects typically expose a jwt() helper.
    if (typeof user?.jwt === 'function') {
      // Force refresh because access tokens expire ~hourly.
      // If refresh fails, fall back to any existing token.
      const jwt = await user.jwt(true)
      if (typeof jwt === 'string' && jwt.length > 0) return jwt
    }

    return null
  } catch {
    return null
  }
}

/**
 * ANALYTICS DASHBOARD
 * Shows article performance metrics
 * ADMIN ONLY - Protected by layout
 */
export default function AnalyticsPage() {
  const [ga, setGa] = useState<Ga4ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [range, setRange] = useState<'7d' | '30d'>('30d')

  useEffect(() => {
    loadAnalytics()
  }, [range])

  const loadAnalytics = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = await getIdentityAccessToken()
      const response = await fetch(`/api/admin/ga4?range=${range}`, {
        headers: token ? { authorization: `Bearer ${token}` } : undefined,
      })

      const data = (await response.json()) as Ga4ApiResponse
      if (!response.ok) {
        setGa(data)
        const serverError = 'error' in data && data.error ? data.error : ''
        const serverReason = 'reason' in data && data.reason ? data.reason : ''

        const parts = [`HTTP ${response.status}`]
        if (serverError) parts.push(serverError)
        if (serverReason) parts.push(serverReason)

        setError(`Failed to load GA4 analytics (${parts.join(' - ')}).`)
        return
      }

      setGa(data)
    } catch (error) {
      console.error('Failed to load analytics:', error)
      setError('Failed to load analytics.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const configured = ga && 'configured' in ga ? ga.configured : false
  const summary = ga && 'summary' in ga ? ga.summary : null
  const topPages = summary?.topPages || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Track article performance and visitor engagement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border bg-background p-1">
            <button
              type="button"
              onClick={() => setRange('7d')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                range === '7d' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              7d
            </button>
            <button
              type="button"
              onClick={() => setRange('30d')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                range === '30d' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              30d
            </button>
          </div>

          <button
            onClick={loadAnalytics}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Total Views</h3>
          </div>
          <p className="text-4xl font-bold">{summary?.totalViews?.toLocaleString() || 0}</p>
          <p className="text-sm opacity-90 mt-2">Last {range === '7d' ? '7' : '30'} days (GA4)</p>
        </div>

        <div className="bg-linear-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Total Users</h3>
          </div>
          <p className="text-4xl font-bold">{summary?.totalUsers?.toLocaleString() || 0}</p>
          <p className="text-sm opacity-90 mt-2">Last {range === '7d' ? '7' : '30'} days (GA4)</p>
        </div>

        <div className="bg-linear-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Top Pages</h3>
          </div>
          <p className="text-4xl font-bold">{topPages.length}</p>
          <p className="text-sm opacity-90 mt-2">Ranked by views</p>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-4">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {ga && 'configured' in ga && !ga.configured && (
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>GA4 not configured:</strong> Set GA4 service account credentials and property ID in the
            environment, then redeploy.
          </p>
        </div>
      )}

      {/* Top Articles Table */}
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="bg-muted px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Top Pages (GA4)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Page Path
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Users
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {!configured || topPages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No GA4 data available yet (or GA4 not configured).
                  </td>
                </tr>
              ) : (
                topPages.map((row, index) => {
                  return (
                    <tr key={row.path} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium text-foreground">{row.path}</div>
                            <div className="text-sm text-muted-foreground">
                              {row.path}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-lg font-bold text-foreground">
                          {row.views.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm text-muted-foreground">{row.users.toLocaleString()}</span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>Note:</strong> This dashboard pulls metrics from GA4 via a server-side API route.
          For local testing, run via <code className="px-1 py-0.5 bg-blue-100/50 dark:bg-blue-900/40 rounded">netlify dev</code>
          so Netlify Identity endpoints work.
        </p>
      </div>
    </div>
  )
}
