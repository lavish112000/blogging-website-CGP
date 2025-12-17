'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, Send, Bell, CheckCircle } from 'lucide-react'

interface BreakingPost {
  slug: string
  title: string
  category: string
  breaking: boolean
  url: string
  summary?: string
}

/**
 * BREAKING NEWS MANAGER
 * Toggle breaking status and send notifications
 * ADMIN ONLY - Protected by layout
 */
export default function BreakingNewsPage() {
  const [posts, setPosts] = useState<BreakingPost[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState<string | null>(null)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      // Placeholder data
      setPosts([
        {
          slug: 'sundar-pichai-ai-jobs-warning',
          title: 'Sundar Pichai Warns AI Will Rapidly Reshape Jobs',
          category: 'technology',
          breaking: true,
          url: 'https://tech-knowlogia.netlify.app/technology/sundar-pichai-ai-jobs-warning',
          summary: 'Google CEO says automation will affect every sector, urges governments and companies to act'
        },
        {
          slug: 'ai-trends-2025',
          title: 'The Age of Infrastructure: How AI Went from Innovation to Utility',
          category: 'technology',
          breaking: false,
          url: 'https://tech-knowlogia.netlify.app/technology/ai-trends-2025',
          summary: 'AI has transitioned from future technology to infrastructure in just 18 months'
        },
      ])
    } catch (error) {
      console.error('Failed to load posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleBreaking = async (slug: string) => {
    setPosts(posts.map(post =>
      post.slug === slug ? { ...post, breaking: !post.breaking } : post
    ))
    // In production, save to API
    // await fetch(`/api/admin/posts/${slug}`, { method: 'PATCH', body: JSON.stringify({ breaking: !post.breaking }) })
  }

  const sendNotification = async (post: BreakingPost) => {
    setSending(post.slug)
    try {
      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: post.title,
          url: post.url,
          summary: post.summary,
          category: post.category
        })
      })

      if (response.ok) {
        alert(`✅ Notification sent for: ${post.title}`)
      } else {
        alert('❌ Failed to send notification')
      }
    } catch (error) {
      console.error('Failed to send notification:', error)
      alert('❌ Error sending notification')
    } finally {
      setSending(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading articles...</p>
        </div>
      </div>
    )
  }

  const breakingPosts = posts.filter(p => p.breaking)
  const regularPosts = posts.filter(p => !p.breaking)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Breaking News Manager</h1>
        <p className="text-muted-foreground mt-2">
          Mark articles as breaking news and send push notifications
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">Breaking News Guidelines</h3>
            <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
              <li>• Use sparingly - only for truly breaking, time-sensitive news</li>
              <li>• Toggle &ldquo;Breaking&rdquo; to add red badge to article</li>
              <li>• Click &ldquo;Send Notification&rdquo; to alert subscribers</li>
              <li>• Notifications go to all subscribers (cannot be undone)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Active Breaking News */}
      <div className="bg-card border-2 border-red-500 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          <h2 className="text-xl font-semibold">Active Breaking News ({breakingPosts.length})</h2>
        </div>
        {breakingPosts.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No breaking news articles currently active</p>
        ) : (
          <div className="space-y-3">
            {breakingPosts.map((post) => (
              <BreakingNewsCard
                key={post.slug}
                post={post}
                onToggleBreaking={toggleBreaking}
                onSendNotification={sendNotification}
                sending={sending === post.slug}
              />
            ))}
          </div>
        )}
      </div>

      {/* Regular Articles */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Regular Articles ({regularPosts.length})</h2>
        <div className="space-y-3">
          {regularPosts.map((post) => (
            <BreakingNewsCard
              key={post.slug}
              post={post}
              onToggleBreaking={toggleBreaking}
              onSendNotification={sendNotification}
              sending={sending === post.slug}
            />
          ))}
        </div>
      </div>

      {/* Notification Setup */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Notification Setup
        </h3>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Push notifications are ready to use. For production, configure:
        </p>
        <ul className="text-sm text-blue-800 dark:text-blue-200 mt-2 space-y-1 ml-4">
          <li>• OneSignal for web push notifications</li>
          <li>• Resend/SendGrid for email notifications</li>
          <li>• Firebase Cloud Messaging for mobile apps</li>
        </ul>
        <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
          See <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">PUBLISHER_FEATURES.md</code> for setup guide.
        </p>
      </div>
    </div>
  )
}

function BreakingNewsCard({
  post,
  onToggleBreaking,
  onSendNotification,
  sending
}: {
  post: BreakingPost
  onToggleBreaking: (slug: string) => void
  onSendNotification: (post: BreakingPost) => void
  sending: boolean
}) {
  return (
    <div className={`p-4 rounded-lg border-2 ${post.breaking ? 'bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800' : 'bg-muted/30 border-transparent'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium">{post.title}</h3>
            {post.breaking && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                🔴 BREAKING
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2 capitalize">{post.category}</p>
          {post.summary && (
            <p className="text-sm text-muted-foreground line-clamp-2">{post.summary}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Breaking */}
          <button
            onClick={() => onToggleBreaking(post.slug)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              post.breaking
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {post.breaking ? (
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Breaking
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Mark Breaking
              </span>
            )}
          </button>

          {/* Send Notification */}
          {post.breaking && (
            <button
              onClick={() => onSendNotification(post)}
              disabled={sending}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {sending ? 'Sending...' : 'Notify'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
