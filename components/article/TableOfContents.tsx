'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface TOCItem {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Extract headings from content
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = content
    
    const headingElements = tempDiv.querySelectorAll('h2, h3')
    const items: TOCItem[] = []
    
    headingElements.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1))
      const title = heading.textContent || ''
      const id = heading.id || `heading-${index}`
      
      items.push({ id, title, level })
    })
    
    setHeadings(items)
  }, [content])

  useEffect(() => {
    // Create intersection observer for scroll spy
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0.5,
      }
    )

    // Observe all headings
    const headingElements = document.querySelectorAll('h2[id], h3[id]')
    headingElements.forEach((el) => observerRef.current?.observe(el))

    return () => {
      headingElements.forEach((el) => observerRef.current?.unobserve(el))
    }
  }, [])

  if (headings.length === 0) return null

  return (
    <nav className="hidden xl:block sticky top-24 max-h-[calc(100vh-6rem)] overflow-auto">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground mb-4">
          Table of Contents
        </p>
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 2) * 1}rem` }}
            >
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  })
                }}
                className={`
                  block py-1 px-2 rounded-md transition-all duration-200
                  hover:text-primary hover:bg-primary/5
                  ${
                    activeId === heading.id
                      ? 'text-primary font-medium bg-primary/10 border-l-2 border-primary'
                      : 'text-muted-foreground'
                  }
                `}
              >
                {heading.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
