'use client'

import { useState, useEffect } from 'react'
import { Users, Mail, Clock, UserX, Download, Trash2, RefreshCw } from 'lucide-react'

type SubscriberStatus = 'active' | 'pending' | 'unsubscribed'

type Subscriber = {
  _id: string
  email: string
  status: SubscriberStatus
  createdAt: string
  confirmedAt?: string
  unsubscribedAt?: string
}

type SubscriberCounts = {
  total: number
  active: number
  pending: number
  unsubscribed: number
}

async function getIdentityAccessToken(): Promise<string | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const identity = (window as any)?.netlifyIdentity
    const user = identity?.currentUser?.()
    if (typeof user?.jwt === 'function') {
      const jwt = await user.jwt(true)
      if (typeof jwt === 'string' && jwt.length > 0) return jwt
    }
    return user?.token?.access_token || null
  } catch {
    return null
  }
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [counts, setCounts] = useState<SubscriberCounts>({
    total: 0,
    active: 0,
    pending: 0,
    unsubscribed: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | SubscriberStatus>('all')

  useEffect(() => {
    loadSubscribers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const loadSubscribers = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = await getIdentityAccessToken()
      const statusParam = filter === 'all' ? '' : `?status=${filter}`
      const response = await fetch(`/api/admin/subscribers${statusParam}`, {
        headers: token ? { authorization: `Bearer ${token}` } : undefined,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to load subscribers')
      }

      const data = await response.json()
      setSubscribers(data.subscribers || [])
      setCounts(data.counts || { total: 0, active: 0, pending: 0, unsubscribed: 0 })
    } catch (err) {
      console.error('Failed to load subscribers:', err)
      setError(err instanceof Error ? err.message : 'Failed to load subscribers')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return

    try {
      const token = await getIdentityAccessToken()
      const response = await fetch(`/api/admin/subscribers?id=${id}`, {
        method: 'DELETE',
        headers: token ? { authorization: `Bearer ${token}` } : undefined,
      })

      if (!response.ok) {
        throw new Error('Failed to delete subscriber')
      }

      await loadSubscribers()
    } catch (err) {
      console.error('Failed to delete subscriber:', err)
      alert('Failed to delete subscriber')
    }
  }

  const handleExportCSV = async () => {
    try {
      const token = await getIdentityAccessToken()
      const statusParam = filter === 'all' ? '' : `?status=${filter}&`
      const url = `/api/admin/subscribers${statusParam ? '?' : ''}${statusParam}format=csv`
      
      const response = await fetch(url, {
        headers: token ? { authorization: `Bearer ${token}` } : undefined,
      })

      if (!response.ok) {
        throw new Error('Failed to export CSV')
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(downloadUrl)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Failed to export CSV:', err)
      alert('Failed to export CSV')
    }
  }

  if (loading && subscribers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading subscribers...</p>
        </div>
      </div>
    )
  }

  const displayedSubscribers = subscribers

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Email Subscribers</h1>
          <p className="text-muted-foreground mt-2">Manage your newsletter subscriber list</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadSubscribers}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Total</h3>
          </div>
          <p className="text-4xl font-bold">{counts.total.toLocaleString()}</p>
        </div>

        <div className="bg-linear-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Active</h3>
          </div>
          <p className="text-4xl font-bold">{counts.active.toLocaleString()}</p>
        </div>

        <div className="bg-linear-to-br from-yellow-500 to-yellow-600 text-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Pending</h3>
          </div>
          <p className="text-4xl font-bold">{counts.pending.toLocaleString()}</p>
        </div>

        <div className="bg-linear-to-br from-red-500 to-red-600 text-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <UserX className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Unsubscribed</h3>
          </div>
          <p className="text-4xl font-bold">{counts.unsubscribed.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            filter === 'active' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            filter === 'pending' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('unsubscribed')}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            filter === 'unsubscribed' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Unsubscribed
        </button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-4">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Subscribed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Confirmed
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {displayedSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No subscribers found.
                  </td>
                </tr>
              ) : (
                displayedSubscribers.map((sub) => {
                  const statusColor =
                    sub.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                      : sub.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'

                  return (
                    <tr key={sub._id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{sub.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {sub.confirmedAt ? new Date(sub.confirmedAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(sub._id)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
