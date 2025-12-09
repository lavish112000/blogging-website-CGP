import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Post, PostFrontmatter, Category } from './types'
import { calculateReadingTime } from './utils'

const contentDirectory = path.join(process.cwd(), 'content')

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
    
    const frontmatter = data as PostFrontmatter
    const readTime = calculateReadingTime(content)

    return {
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      content,
      date: frontmatter.date,
      category: frontmatter.category || category,
      tags: frontmatter.tags || [],
      author: frontmatter.author || 'Vibrant Insights Team',
      readTime,
      featured: frontmatter.featured || false,
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
