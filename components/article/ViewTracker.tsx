'use client'

import { useEffect } from 'react'

interface ViewTrackerProps {
  slug: string
  category: string
}

/**
 * Client component to track article views
 * Sends a POST request to /api/views when article is viewed
 */
export function ViewTracker({ slug, category }: ViewTrackerProps) {
  useEffect(() => {
    // Track view after component mounts
    const trackView = async () => {
      try {
        await fetch('/api/views', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slug: `${category}/${slug}` }),
        })
      } catch (error) {
        console.error('Failed to track view:', error)
      }
    }

    trackView()
  }, [slug, category])

  // This component doesn't render anything
  return null
}
