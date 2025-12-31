'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'

const STORAGE_KEY = 'tk_cookie_consent'
const COOKIE_KEY = STORAGE_KEY

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

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const entries = document.cookie.split(';')
  for (const entry of entries) {
    const [rawKey, ...rawVal] = entry.trim().split('=')
    if (!rawKey) continue
    if (decodeURIComponent(rawKey) !== name) continue
    return decodeURIComponent(rawVal.join('='))
  }
  return null
}

function readStoredConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'granted' || stored === 'denied') return stored
  } catch {
    // Ignore
  }

  const cookieVal = readCookie(COOKIE_KEY)
  return cookieVal === 'granted' || cookieVal === 'denied' ? cookieVal : null
}

function persistConsent(choice: ConsentState) {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice)
    } catch {
      // Ignore
    }
  }

  if (typeof document !== 'undefined') {
    // 1 year persistence, first-party cookie.
    document.cookie = `${encodeURIComponent(COOKIE_KEY)}=${encodeURIComponent(
      choice
    )}; Max-Age=31536000; Path=/; SameSite=Lax`
  }
}

export function CookieConsent() {
  const pathname = usePathname()
  const [consent, setConsent] = useState<ConsentState | null>(null)
  const [hydrated, setHydrated] = useState(false)

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
    setHydrated(true)
    setConsent(readStoredConsent())
  }, [])

  useEffect(() => {
    if (isAdminRoute) return
    if (!consent) return
    updateGoogleConsent(consent)
  }, [consent, isAdminRoute])

  if (!hydrated || isAdminRoute || consent) return null

  const onChoice = (choice: ConsentState) => {
    persistConsent(choice)

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
