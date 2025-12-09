import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { Category } from '@/lib/types'
import { getCategoryInfo } from '@/lib/categories'

interface BreadcrumbsProps {
  category: Category
  title: string
}

export function Breadcrumbs({ category, title }: BreadcrumbsProps) {
  const categoryInfo = getCategoryInfo(category)

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Link
        href="/"
        className="flex items-center hover:text-primary transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      <ChevronRight className="w-4 h-4" />
      <Link
        href={`/${category}`}
        className="hover:text-primary transition-colors capitalize"
      >
        {categoryInfo.name}
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-foreground line-clamp-1">{title}</span>
    </nav>
  )
}
