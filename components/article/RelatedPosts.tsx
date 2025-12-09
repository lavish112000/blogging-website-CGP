import { Post } from '@/lib/types'
import { ArticleCard } from './ArticleCard'

interface RelatedPostsProps {
  posts: Post[]
  title?: string
}

export function RelatedPosts({ posts, title = 'Related Articles' }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section className="py-12 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-3xl font-bold mb-8">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
