'use client'

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import { NetlifyUser, isAdmin, isEditor, getUserRole } from '@/lib/auth'

interface AuthContextType {
  user: NetlifyUser | null
  loading: boolean
  isAdmin: boolean
  isEditor: boolean
  role: 'admin' | 'editor' | 'public'
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  isEditor: false,
  role: 'public',
  login: () => {},
  logout: () => {}
})

export function useAuth() {
  return useContext(AuthContext)
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<NetlifyUser | null>(null)
  const [loading, setLoading] = useState(true)
  const initializedRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    const maybeOpenRecovery = () => {
      const hash = window.location.hash || ''
      const hasToken =
        hash.includes('recovery_token=') ||
        hash.includes('invite_token=') ||
        hash.includes('confirmation_token=')

      if (hasToken) {
        try {
          window.netlifyIdentity?.open()
        } catch {
          // Ignore - widget might still be initializing
        }
      }
    }

    const ensureIdentityScript = () => {
      if (window.netlifyIdentity) return
      const existing = document.querySelector('script[data-netlify-identity="true"]')
      if (existing) return

      const script = document.createElement('script')
      script.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js'
      script.async = true
      script.setAttribute('data-netlify-identity', 'true')
      document.head.appendChild(script)
    }

    const initIdentity = () => {
      if (cancelled) return
      if (initializedRef.current) return
      if (!window.netlifyIdentity) return

      initializedRef.current = true

      window.netlifyIdentity.on('login', (user?: NetlifyUser) => {
        setUser(user || null)
        setLoading(false)
      })

      window.netlifyIdentity.on('logout', () => {
        setUser(null)
        setLoading(false)
      })

      window.netlifyIdentity.on('init', (user?: NetlifyUser) => {
        setUser(user || null)
        setLoading(false)
        maybeOpenRecovery()
      })

      window.netlifyIdentity.init()
      // If the init event fired before we attached (rare), still try to open recovery.
      setTimeout(maybeOpenRecovery, 0)
    }

    if (typeof window !== 'undefined') {
      // If we're on a recovery/invite link, make sure the Identity script exists.
      const hash = window.location.hash || ''
      const hasToken =
        hash.includes('recovery_token=') ||
        hash.includes('invite_token=') ||
        hash.includes('confirmation_token=')

      if (hasToken) {
        ensureIdentityScript()
      }

      window.addEventListener('hashchange', maybeOpenRecovery)

      // The identity script can load after hydration; retry briefly.
      initIdentity()
      const retryIntervals = [50, 150, 300, 600, 1200, 2500, 5000, 8000]
      const timers = retryIntervals.map((ms) => setTimeout(initIdentity, ms))

      // Also poll for a short while in case script loads late.
      const start = Date.now()
      const poll = setInterval(() => {
        if (cancelled) return
        initIdentity()
        if (initializedRef.current) clearInterval(poll)
        if (Date.now() - start > 10000) clearInterval(poll)
      }, 200)

      // Don’t block the UI forever if Identity is disabled/missing.
      const safetyTimer = setTimeout(() => {
        if (!cancelled) setLoading(false)
      }, 2000)

      return () => {
        cancelled = true
        window.removeEventListener('hashchange', maybeOpenRecovery)
        timers.forEach(clearTimeout)
        clearInterval(poll)
        clearTimeout(safetyTimer)
      }
    }

    // Fallback (should not happen in client component)
    setTimeout(() => setLoading(false), 0)
  }, [])

  const login = () => {
    if (window.netlifyIdentity) {
      window.netlifyIdentity.open('login')
    }
  }

  const logout = () => {
    if (window.netlifyIdentity) {
      window.netlifyIdentity.logout()
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    isAdmin: isAdmin(user),
    isEditor: isEditor(user),
    role: getUserRole(user),
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Type augmentation for window.netlifyIdentity
declare global {
  interface Window {
    netlifyIdentity?: {
      currentUser: () => NetlifyUser | null
      open: (tab?: 'login' | 'signup') => void
      logout: () => void
      on: (event: string, callback: (user?: NetlifyUser) => void) => void
      init: () => void
    }
  }
}
