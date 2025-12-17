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
      // The identity script can load after hydration; retry briefly.
      initIdentity()
      const retryIntervals = [50, 150, 300, 600, 1200]
      const timers = retryIntervals.map((ms) => setTimeout(initIdentity, ms))

      // Don’t block the UI forever if Identity is disabled/missing.
      const safetyTimer = setTimeout(() => {
        if (!cancelled) setLoading(false)
      }, 2000)

      return () => {
        cancelled = true
        timers.forEach(clearTimeout)
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
