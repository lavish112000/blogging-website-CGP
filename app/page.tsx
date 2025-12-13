import { HeroSection } from '@/components/home/HeroSection'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { NewsletterSection } from '@/components/home/NewsletterSection'
import { ArticleCard } from '@/components/article/ArticleCard'
import { getAllPosts, getFeaturedPosts } from '@/lib/mdx'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home | Tech-Knowlogia - Tech, Design & Lifestyle Blog',
  description: 'Welcome to Tech-Knowlogia. Discover the latest articles on technology, web development, design trends, lifestyle tips, and business strategies.',
  alternates: {
    canonical: 'https://tech-knowlogia.com',
  },
}

export default async function Home() {
  // Get featured posts for homepage
  const featuredPosts = await getFeaturedPosts(3)
  const latestPosts = await getAllPosts().then(posts => posts.slice(0, 6))

  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Articles Section */}
      {featuredPosts.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Featured <span className="gradient-text-primary">Articles</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Hand-picked comprehensive guides to help you master your craft
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <ArticleCard key={post.slug} post={post} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Grid */}
      <CategoryGrid />

      {/* Latest Articles */}
      {latestPosts.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Latest <span className="gradient-text-primary">Articles</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Fresh insights and expert knowledge across all categories
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <NewsletterSection />
    </>
  )
}
