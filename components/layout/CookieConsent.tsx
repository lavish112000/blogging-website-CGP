'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'

const STORAGE_KEY = 'tk_cookie_consent'

type ConsentState = 'granted' | 'denied'

type GtagFn = (...args: unknown[]) => void

function updateGoogleConsent(state: ConsentState) {
  if (typeof window === 'undefined') return

  const gtag = (window as unknown as { gtag?: GtagFn }).gtag
  if (typeof gtag !== 'function') return

  const granted = state === 'granted'

  gtag('consent', 'update', {
    ad_storage: granted ? 'granted' : 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
  })
}

export function CookieConsent() {
  const pathname = usePathname()
  const [consent, setConsent] = useState<ConsentState | null>(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      return stored === 'granted' || stored === 'denied' ? stored : null
    } catch {
      return null
    }
  })

  const isAdminRoute = useMemo(() => {
    if (!pathname) return false
    return (
      pathname === '/admin' ||
      pathname.startsWith('/admin/') ||
      pathname === '/admin-dashboard' ||
      pathname.startsWith('/admin-dashboard/')
    )
  }, [pathname])

  useEffect(() => {
    if (isAdminRoute) return
    if (!consent) return
    updateGoogleConsent(consent)
  }, [consent, isAdminRoute])

  if (isAdminRoute || consent) return null

  const onChoice = (choice: ConsentState) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice)
    } catch {
      // Ignore
    }

    updateGoogleConsent(choice)
    setConsent(choice)
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="container mx-auto flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          We use cookies for analytics and ads measurement. You can accept or reject non-essential cookies.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChoice('denied')}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground hover:bg-muted"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => onChoice('granted')}
            className="h-9 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
