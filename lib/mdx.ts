import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import { Post, PostFrontmatter, Category } from './types'
import { calculateReadingTime } from './utils'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

const contentDirectory = path.join(process.cwd(), 'content')

function normalizeEncodingArtifacts(input: string): string {
  return input
    // Common UTF-8/Windows-1252 mojibake
    .replaceAll('â€œ', '“')
    .replaceAll('â€', '”')
    .replaceAll('â€˜', '‘')
    .replaceAll('â€™', '’')
    .replaceAll('â€”', '—')
    .replaceAll('â€“', '–')
    .replaceAll('â€¦', '…')
    .replaceAll('â€¢', '•')
    .replaceAll('â†’', '→')
    // Double-mojibake variants seen in content
    .replaceAll('€œ', '“')
    .replaceAll('€\u009d', '”')
    .replaceAll('€\u009c', '“')
    .replaceAll('€', '”')
    .replaceAll('€˜', '‘')
    .replaceAll('€™', '’')
    .replaceAll('€”', '—')
    .replaceAll('€“', '–')
    // Arrow artifacts used in headings/TOCs
    .replaceAll('†’', '→')
    // Stray non-breaking-space marker
    .replaceAll('Â', '')
}

function normalizeDeep<T>(value: T): T {
  if (typeof value === 'string') {
    return normalizeEncodingArtifacts(value) as T
  }

  if (Array.isArray(value)) {
    return value.map(v => normalizeDeep(v)) as T
  }

  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      result[key] = normalizeDeep(val)
    }
    return result as T
  }

  return value
}

function stripEditorialBlocks(input: string): string {
  // These sections were scaffolding notes for adding real photos later.
  // They should never render on the site.
  return input
    .replace(
      /^##\s+Image placement instructions\b[^\n]*\n[\s\S]*?(?=^##\s+|\Z)/gmi,
      ''
    )
    .replace(
      /^##\s+Image guidance\b[^\n]*\n[\s\S]*?(?=^##\s+|\Z)/gmi,
      ''
    )
    // Collapse accidental extra whitespace left behind
    .replace(/\n{3,}/g, '\n\n')
}

/**
 * Get all posts from a specific category
 */
export async function getPostsByCategory(category: Category): Promise<Post[]> {
  const categoryPath = path.join(contentDirectory, category)
  
  if (!fs.existsSync(categoryPath)) {
    return []
  }
  
  const files = fs.readdirSync(categoryPath)
  const posts: Post[] = []

  for (const file of files) {
    if (file.endsWith('.mdx')) {
      const slug = file.replace('.mdx', '')
      const post = await getPostBySlug(slug, category)
      if (post) {
        posts.push(post)
      }
    }
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Get a single post by slug and category
 */
export async function getPostBySlug(slug: string, category: Category): Promise<Post | null> {
  try {
    const filePath = path.join(contentDirectory, category, `${slug}.mdx`)
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContent)
    
    const frontmatter = normalizeDeep(data) as PostFrontmatter
    const normalizedContent = normalizeEncodingArtifacts(content)
    const cleanedContent = stripEditorialBlocks(normalizedContent)
    const readTime = calculateReadingTime(cleanedContent)
    const htmlContent = md.render(cleanedContent)

    const priority = typeof frontmatter.priority === 'number' ? frontmatter.priority : undefined
    const breaking = frontmatter.breaking === true

    return {
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      content: htmlContent,
      date: frontmatter.date,
      category: frontmatter.category || category,
      tags: frontmatter.tags || [],
      author: frontmatter.author || 'Tech-Knowlogia Team',
      readTime,
      featured: frontmatter.featured || false,
      priority,
      breaking,
      summary: frontmatter.summary,
      image: frontmatter.image,
      seo: frontmatter.seo
    }
  } catch (error) {
    console.error(`Error loading post ${slug} from ${category}:`, error)
    return null
  }
}

/**
 * Get all posts from all categories
 */
export async function getAllPosts(): Promise<Post[]> {
  const categories: Category[] = ['blog', 'lifestyle', 'design', 'technology', 'business']
  const allPosts: Post[] = []

  for (const category of categories) {
    const posts = await getPostsByCategory(category)
    allPosts.push(...posts)
  }

  return allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Get featured posts
 */
export async function getFeaturedPosts(limit: number = 3): Promise<Post[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter(post => post.featured).slice(0, limit)
}

/**
 * Get related posts based on category and tags
 */
export async function getRelatedPosts(currentPost: Post, limit: number = 3): Promise<Post[]> {
  const categoryPosts = await getPostsByCategory(currentPost.category)
  
  return categoryPosts
    .filter(post => post.slug !== currentPost.slug)
    .sort((a, b) => {
      const aMatchingTags = a.tags.filter(tag => currentPost.tags.includes(tag)).length
      const bMatchingTags = b.tags.filter(tag => currentPost.tags.includes(tag)).length
      return bMatchingTags - aMatchingTags
    })
    .slice(0, limit)
}

/**
 * Get all unique tags across all posts
 */
export async function getAllTags(): Promise<string[]> {
  const allPosts = await getAllPosts()
  const tagsSet = new Set<string>()
  
  allPosts.forEach(post => {
    post.tags.forEach(tag => tagsSet.add(tag))
  })
  
  return Array.from(tagsSet).sort()
}
