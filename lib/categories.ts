import { CategoryInfo } from './types'

export const CATEGORIES: CategoryInfo[] = [
  {
    name: 'Web Development',
    slug: 'blog',
    description: 'Master modern web development with cutting-edge frameworks, best practices, and real-world tutorials.',
    color: 'text-blue-600',
    gradient: 'from-blue-600 to-cyan-600',
    icon: 'Code2'
  },
  {
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Elevate your daily life with tips on wellness, productivity, travel, and personal growth.',
    color: 'text-pink-600',
    gradient: 'from-pink-600 to-rose-600',
    icon: 'Heart'
  },
  {
    name: 'Design',
    slug: 'design',
    description: 'Explore UI/UX principles, design systems, and visual strategies that create stunning experiences.',
    color: 'text-purple-600',
    gradient: 'from-purple-600 to-indigo-600',
    icon: 'Palette'
  },
  {
    name: 'Technology',
    slug: 'technology',
    description: 'Stay ahead with insights on AI, cloud computing, cybersecurity, and emerging tech trends.',
    color: 'text-emerald-600',
    gradient: 'from-emerald-600 to-teal-600',
    icon: 'Cpu'
  },
  {
    name: 'Business',
    slug: 'business',
    description: 'Build successful ventures with strategies on marketing, leadership, and entrepreneurship.',
    color: 'text-orange-600',
    gradient: 'from-orange-600 to-amber-600',
    icon: 'Briefcase'
  }
]

export function getCategoryInfo(slug: string): CategoryInfo | undefined {
  return CATEGORIES.find(cat => cat.slug === slug)
}
