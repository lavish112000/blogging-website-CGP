import { getTrendingPosts } from '@/lib/trending'
import { ArticleCard } from '@/components/article/ArticleCard'

export async function TrendingPosts() {
  const posts = await getTrendingPosts(4)

  if (!posts.length) {
    return null
  }

  return (
    <section className="py-16 md:py-24 bg-muted/40 border-y border-border">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trending <span className="gradient-text-primary">Now</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Algorithmically surfaced and editor-prioritized articles from the last 30 days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
