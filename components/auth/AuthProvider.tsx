'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
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

  useEffect(() => {
    // Initialize Netlify Identity
    if (typeof window !== 'undefined' && window.netlifyIdentity) {
      // Listen for auth changes
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
      })

      // Initialize the widget - this triggers the 'init' event which sets user state
      window.netlifyIdentity.init()
    } else {
      // Fallback if Netlify Identity script not loaded
      setLoading(false)
    }
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
