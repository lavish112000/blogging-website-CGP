/**
 * TypeScript Types for Tech-Knowlogia Blog
 */

export type Category = 'blog' | 'lifestyle' | 'design' | 'technology' | 'business'

export interface Author {
  name: string
  bio: string
  avatar?: string
  role?: string
  linkedin?: string
  twitter?: string
  email?: string
}

export interface Post {
  slug: string
  title: string
  description: string
  content: string
  date: string
  category: Category
  tags: string[]
  author: Author | string
  readTime: number
  featured?: boolean
   priority?: number
   breaking?: boolean
   summary?: string
  image?: string
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
  }
}

export interface PostFrontmatter {
  title: string
  description: string
  date: string
  category: Category
  tags: string[]
  author: Author | string
  featured?: boolean
   priority?: number
   breaking?: boolean
   summary?: string
  image?: string
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
  }
}

export interface CategoryInfo {
  name: string
  slug: Category
  description: string
  color: string
  gradient: string
  icon: string
}
