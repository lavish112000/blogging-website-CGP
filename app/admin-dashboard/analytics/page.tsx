'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Eye, BarChart3, RefreshCw } from 'lucide-react'

interface AnalyticsData {
  views: Record<string, number>
  total: number
  articles: number
}

/**
 * ANALYTICS DASHBOARD
 * Shows article performance metrics
 * ADMIN ONLY - Protected by layout
 */
export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/views')
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to load analytics:', error)
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

  const topArticles = analytics?.views
    ? Object.entries(analytics.views)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 20)
    : []

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
        <button
          onClick={loadAnalytics}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Total Views</h3>
          </div>
          <p className="text-4xl font-bold">{analytics?.total.toLocaleString() || 0}</p>
          <p className="text-sm opacity-90 mt-2">All-time page views</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Tracked Articles</h3>
          </div>
          <p className="text-4xl font-bold">{analytics?.articles || 0}</p>
          <p className="text-sm opacity-90 mt-2">With view data</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Avg. per Article</h3>
          </div>
          <p className="text-4xl font-bold">
            {analytics?.articles ? Math.round(analytics.total / analytics.articles) : 0}
          </p>
          <p className="text-sm opacity-90 mt-2">Average views</p>
        </div>
      </div>

      {/* Top Articles Table */}
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="bg-muted px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Top Performing Articles</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Article
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  % of Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topArticles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No analytics data available yet. Views will appear here once articles are visited.
                  </td>
                </tr>
              ) : (
                topArticles.map(([slug, views], index) => {
                  const percentage = analytics?.total
                    ? ((views / analytics.total) * 100).toFixed(1)
                    : '0'
                  
                  return (
                    <tr key={slug} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium text-foreground">{slug}</div>
                            <div className="text-sm text-muted-foreground">
                              /{slug.replace('/', '/')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-lg font-bold text-foreground">
                          {views.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm text-muted-foreground">{percentage}%</span>
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
          <strong>Note:</strong> Analytics data is currently stored in memory and resets on server restart. 
          For production, integrate with a database (Vercel KV, PostgreSQL, or MongoDB) for persistent tracking.
        </p>
      </div>
    </div>
  )
}
