import { NextResponse } from 'next/server'

/**
 * Simple in-memory view tracking for analytics
 * For production: Use Redis, PostgreSQL, or Vercel KV
 */

// In-memory store (resets on server restart)
let views: Record<string, number> = {}

/**
 * POST /api/views
 * Track a view for a specific article slug
 */
export async function POST(req: Request) {
  try {
    const { slug } = await req.json()
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    // Increment view count
    views[slug] = (views[slug] || 0) + 1

    return NextResponse.json({ 
      slug, 
      views: views[slug],
      success: true 
    })
  } catch (error) {
    console.error('Error tracking view:', error)
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 })
  }
}

/**
 * GET /api/views
 * Get all article view counts (for admin analytics)
 */
export async function GET() {
  try {
    // Sort by views descending
    const sortedViews = Object.entries(views)
      .sort(([, a], [, b]) => b - a)
      .reduce((acc, [slug, count]) => {
        acc[slug] = count
        return acc
      }, {} as Record<string, number>)

    return NextResponse.json({
      views: sortedViews,
      total: Object.values(views).reduce((sum, count) => sum + count, 0),
      articles: Object.keys(views).length
    })
  } catch (error) {
    console.error('Error fetching views:', error)
    return NextResponse.json({ error: 'Failed to fetch views' }, { status: 500 })
  }
}
