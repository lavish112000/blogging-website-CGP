'use client'

import { useState, useEffect } from 'react'
import { Star, Save } from 'lucide-react'

interface Post {
  slug: string
  title: string
  category: string
  featured?: boolean
  priority?: number
  breaking?: boolean
}

/**
 * TRENDING CONTROLS
 * Manage featured articles and priority
 * ADMIN ONLY - Protected by layout
 */
export default function TrendingPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      // In production, fetch from API
      // const response = await fetch('/api/admin/posts')
      // For now, we'll show placeholder data
      setPosts([
        { slug: 'sundar-pichai-ai-jobs-warning', title: 'Sundar Pichai AI Jobs Warning', category: 'technology', featured: true, priority: 9, breaking: true },
        { slug: 'ai-trends-2025', title: 'AI Trends 2025', category: 'technology', featured: true, priority: 8 },
        { slug: 'digital-marketing-2025', title: 'Digital Marketing 2025', category: 'business', featured: true, priority: 7 },
        { slug: 'modern-ui-ux-principles', title: 'Modern UI/UX Principles', category: 'design', featured: false, priority: 6 },
        { slug: 'future-of-web-development', title: 'Future of Web Development', category: 'blog', featured: false, priority: 5 },
      ])
    } catch (error) {
      console.error('Failed to load posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFeatured = (slug: string) => {
    setPosts(posts.map(post => 
      post.slug === slug ? { ...post, featured: !post.featured } : post
    ))
  }

  const updatePriority = (slug: string, priority: number) => {
    setPosts(posts.map(post => 
      post.slug === slug ? { ...post, priority } : post
    ))
  }

  const saveChanges = async () => {
    setSaving(true)
    try {
      // In production, save to API
      // await fetch('/api/admin/posts', { method: 'PUT', body: JSON.stringify(posts) })
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      alert('Changes saved successfully!')
    } catch (error) {
      console.error('Failed to save:', error)
      alert('Failed to save changes')
    } finally {
      setSaving(false)
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

  const featuredPosts = posts.filter(p => p.featured).sort((a, b) => (b.priority || 0) - (a.priority || 0))
  const nonFeaturedPosts = posts.filter(p => !p.featured).sort((a, b) => (b.priority || 0) - (a.priority || 0))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trending Controls</h1>
          <p className="text-muted-foreground mt-2">
            Manage featured articles and homepage priority
          </p>
        </div>
        <button
          onClick={saveChanges}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">How It Works</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• <strong>Featured</strong> - Article appears in trending/hero sections</li>
          <li>• <strong>Priority (1-10)</strong> - Higher priority = more prominent placement</li>
          <li>• <strong>Breaking News</strong> - Shows red breaking badge (managed separately)</li>
        </ul>
      </div>

      {/* Featured Articles */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-yellow-500" />
          <h2 className="text-xl font-semibold">Featured Articles ({featuredPosts.length})</h2>
        </div>
        <div className="space-y-3">
          {featuredPosts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No featured articles yet</p>
          ) : (
            featuredPosts.map((post) => (
              <ArticleCard
                key={post.slug}
                post={post}
                onToggleFeatured={toggleFeatured}
                onUpdatePriority={updatePriority}
              />
            ))
          )}
        </div>
      </div>

      {/* Other Articles */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Other Articles ({nonFeaturedPosts.length})</h2>
        <div className="space-y-3">
          {nonFeaturedPosts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">All articles are featured</p>
          ) : (
            nonFeaturedPosts.map((post) => (
              <ArticleCard
                key={post.slug}
                post={post}
                onToggleFeatured={toggleFeatured}
                onUpdatePriority={updatePriority}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function ArticleCard({ 
  post, 
  onToggleFeatured, 
  onUpdatePriority 
}: { 
  post: Post
  onToggleFeatured: (slug: string) => void
  onUpdatePriority: (slug: string, priority: number) => void
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium">{post.title}</h3>
          {post.breaking && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              Breaking
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground capitalize">{post.category}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Priority Slider */}
        <div className="flex items-center gap-2">
          <label htmlFor={`priority-${post.slug}`} className="text-xs text-muted-foreground">Priority:</label>
          <input
            id={`priority-${post.slug}`}
            type="range"
            min="1"
            max="10"
            value={post.priority || 5}
            onChange={(e) => onUpdatePriority(post.slug, parseInt(e.target.value))}
            className="w-24"
            aria-label="Article priority from 1 to 10"
          />
          <span className="text-sm font-bold w-6 text-center">{post.priority || 5}</span>
        </div>

        {/* Featured Toggle */}
        <button
          onClick={() => onToggleFeatured(post.slug)}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            post.featured
              ? 'bg-yellow-500 text-white hover:bg-yellow-600'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {post.featured ? (
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4" fill="currentColor" />
              Featured
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              Feature
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
