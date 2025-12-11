import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Calendar, Clock } from 'lucide-react'
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/mdx'
import { formatDate } from '@/lib/utils'
import { getCategoryInfo } from '@/lib/categories'
import { Breadcrumbs } from '@/components/article/Breadcrumbs'
import { TableOfContents } from '@/components/article/TableOfContents'
import { AuthorBio } from '@/components/article/AuthorBio'
import { ShareButtons } from '@/components/article/ShareButtons'
import { RelatedPosts } from '@/components/article/RelatedPosts'
import { Category } from '@/lib/types'
import type { Metadata } from 'next'

interface ArticlePageProps {
  params: Promise<{
    category: Category
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  
  return posts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { category, slug } = await params
  const post = await getPostBySlug(slug, category)

  if (!post) {
    return {
      title: 'Article Not Found',
    }
  }

  const authorName = typeof post.author === 'string' ? post.author : post.author?.name || 'Vibrant Insights'

  return {
    title: `${post.title} | Vibrant Insights`,
    description: post.description,
    keywords: post.tags?.join(', '),
    authors: [{ name: authorName }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [authorName],
      images: post.image ? [{ url: post.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : [],
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { category, slug } = await params
  const post = await getPostBySlug(slug, category)

  if (!post) {
    notFound()
  }

  const categoryInfo = getCategoryInfo(category)
  
  if (!categoryInfo) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post, 3)
  const currentUrl = `https://vibrantinsights.com/${category}/${slug}`

  return (
    <article className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-muted/50 to-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Breadcrumbs category={category} title={post.title} />
          
          <div className="space-y-4">
            {/* Category Badge */}
            <div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white bg-linear-to-r ${categoryInfo.gradient}`}
              >
                {categoryInfo.name}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              {post.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground">
              {post.description}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.image && (
        <div className="relative w-full h-[400px] md:h-[500px] bg-muted">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Article Content with TOC */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_250px] gap-12">
            {/* Main Content */}
            <div className="min-w-0">
              {/* Article Body */}
              <div
                className="prose prose-lg dark:prose-invert max-w-none mb-12"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-border">
                  <span className="text-sm font-medium text-muted-foreground mr-2">
                    Tags:
                  </span>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-muted text-foreground text-sm rounded-full hover:bg-primary hover:text-white transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share Buttons */}
              <div className="py-8 border-b border-border">
                <ShareButtons title={post.title} url={currentUrl} />
              </div>

              {/* Author Bio */}
              {post.author && typeof post.author !== 'string' && (
                <div className="py-8">
                  <AuthorBio author={post.author} />
                </div>
              )}
            </div>

            {/* Table of Contents - Sidebar */}
            <aside className="hidden xl:block">
              <TableOfContents content={post.content} />
            </aside>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-muted/30 border-t border-border">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Related Articles
              </h2>
              <RelatedPosts posts={relatedPosts} />
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
