import { notFound } from 'next/navigation'
import { getPostsByCategory } from '@/lib/mdx'
import { getCategoryInfo, CATEGORIES } from '@/lib/categories'
import { ArticleCard } from '@/components/article/ArticleCard'
import { Category } from '@/lib/types'
import * as Icons from 'lucide-react'
import type { Metadata } from 'next'
import Silk from '@/components/ui/SilkWrapper'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    category: category.slug,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const categoryInfo = getCategoryInfo(category)

  if (!categoryInfo) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${categoryInfo.name} Articles | Vibrant Insights`,
    description: `Explore our collection of articles on ${categoryInfo.name}. ${categoryInfo.description}`,
    keywords: [categoryInfo.name, `${categoryInfo.name} tutorials`, `${categoryInfo.name} guides`, 'Vibrant Insights'],
    openGraph: {
      title: `${categoryInfo.name} Articles | Vibrant Insights`,
      description: categoryInfo.description,
      url: `https://vibrantinsights.com/${category}`,
      type: 'website',
    },
    alternates: {
      canonical: `https://vibrantinsights.com/${category}`,
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const categoryInfo = getCategoryInfo(category)

  if (!categoryInfo) {
    notFound()
  }

  // Cast string to Category type after validation
  const posts = await getPostsByCategory(category as Category)
  const IconComponent = Icons[categoryInfo.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {category === 'lifestyle' && (
          <div className="absolute inset-0 z-0 opacity-60">
            <Silk
              speed={5}
              scale={1}
              color="#29DBFF"
              noiseIntensity={1.5}
              rotation={0}
            />
          </div>
        )}
        <div className={`absolute inset-0 bg-gradient-to-br ${categoryInfo.gradient} opacity-10`} />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${categoryInfo.gradient} mb-8 shadow-lg transform hover:scale-105 transition-transform duration-300`}>
              {IconComponent && <IconComponent className="w-8 h-8 text-white" />}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              {categoryInfo.name}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              {categoryInfo.description}
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 md:py-24">
        <div className="container">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Icons.FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No articles yet</h3>
              <p className="text-muted-foreground">
                Check back soon for new content in {categoryInfo.name}.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
