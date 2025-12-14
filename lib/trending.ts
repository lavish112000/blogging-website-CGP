import { getAllPosts } from './mdx'
import type { Post } from './types'

function scorePost(post: Post, now: Date): number {
  const published = new Date(post.date)
  const ageMs = now.getTime() - published.getTime()
  const dayMs = 1000 * 60 * 60 * 24
  const ageDays = ageMs / dayMs

  // Recency: only consider posts from last 30 days
  const recencyWindowDays = 30
  const recencyFactor = ageDays <= recencyWindowDays ? (recencyWindowDays - ageDays) / recencyWindowDays : 0

  // Priority: editorial weight 1-10 (default mid-scale if undefined)
  const rawPriority = typeof post.priority === 'number' ? post.priority : 5
  const clampedPriority = Math.max(1, Math.min(10, rawPriority))
  const priorityFactor = clampedPriority / 10

  // Featured / Breaking boosts
  const featuredBoost = post.featured ? 0.1 : 0
  const breakingBoost = post.breaking ? 0.2 : 0

  // Weighted score (sum capped to keep scale reasonable)
  const score = (recencyFactor * 0.6) + (priorityFactor * 0.3) + featuredBoost + breakingBoost
  return Math.max(0, score)
}

export async function getTrendingPosts(limit: number = 5): Promise<Post[]> {
  const now = new Date()
  const posts = await getAllPosts()

  const scored = posts
    .map((post) => ({ post, score: scorePost(post, now) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, limit).map(({ post }) => post)
}
