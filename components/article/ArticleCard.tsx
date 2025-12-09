import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { Post } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { getCategoryInfo } from '@/lib/categories'

interface ArticleCardProps {
  post: Post
  featured?: boolean
}

export function ArticleCard({ post, featured = false }: ArticleCardProps) {
  const categoryInfo = getCategoryInfo(post.category)

  if (featured) {
    return (
      <Link
        href={`/${post.category}/${post.slug}`}
        className="group block h-full"
      >
        <article className="h-full rounded-2xl overflow-hidden bg-card border border-gray-200 dark:border-gray-800 card-hover">
          <div className="relative h-64 overflow-hidden">
            {post.image ? (
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${categoryInfo?.gradient || 'from-primary to-primary-600'}`} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/90 text-gray-900">
                {categoryInfo?.name || post.category}
              </span>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>
            
            <p className="text-muted-foreground mb-4 line-clamp-3">
              {post.description}
            </p>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {post.readTime} min read
                </span>
              </div>
              
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link
      href={`/${post.category}/${post.slug}`}
      className="group block h-full"
    >
      <article className="h-full rounded-xl overflow-hidden bg-card border border-gray-200 dark:border-gray-800 card-hover">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${categoryInfo?.gradient || 'from-primary to-primary-600'}`} />
          )}
        </div>

        <div className="p-5">
          {/* Category & Read Time */}
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-semibold uppercase tracking-wider ${categoryInfo?.color || 'text-primary'}`}>
              {categoryInfo?.name || post.category}
            </span>
            <span className="flex items-center text-xs text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              {post.readTime} min
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {post.description}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(post.date)}
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </article>
    </Link>
  )
}
