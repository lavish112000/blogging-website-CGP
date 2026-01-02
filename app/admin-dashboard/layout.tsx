'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { LayoutDashboard, TrendingUp, AlertCircle, Sparkles, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'

interface AdminLayoutProps {
  children: React.ReactNode
}

/**
 * ADMIN DASHBOARD LAYOUT
 * 
 * SECURITY:
 * - Client-side auth check (redirects unauthorized users)
 * - Only renders content for admin role
 * - Includes navigation sidebar
 * - Shows loading state during auth check
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading, isAdmin, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!loading && (!user || !isAdmin)) {
      console.warn('Unauthorized access attempt to admin dashboard')
      router.push('/')
    }
  }, [user, isAdmin, loading, router])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying authorization...</p>
        </div>
      </div>
    )
  }

  // Don't render if not admin (redundant with redirect, but prevents flash)
  if (!user || !isAdmin) {
    return null
  }

  const navItems = [
    { href: '/admin-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin-dashboard/analytics', icon: TrendingUp, label: 'Analytics' },
    { href: '/admin-dashboard/subscribers', icon: TrendingUp, label: 'Subscribers' },
    { href: '/admin-dashboard/trending', icon: TrendingUp, label: 'Trending' },
    { href: '/admin-dashboard/breaking-news', icon: AlertCircle, label: 'Breaking News' },
    { href: '/admin-dashboard/ai-drafts', icon: Sparkles, label: 'AI Drafts' },
    { href: '/admin-dashboard/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground">Tech-Knowlogia Control Center</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Logged in as:</span>
              <span className="ml-2 font-medium">{user.email}</span>
              <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                Admin
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <aside className="col-span-12 lg:col-span-3">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-foreground"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Quick Links */}
            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-sm mb-3">Quick Links</h3>
              <div className="space-y-2 text-sm">
                <Link href="/admin" className="block text-blue-600 hover:underline">
                  CMS Dashboard
                </Link>
                <Link href="/" className="block text-muted-foreground hover:text-foreground">
                  View Public Site
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="col-span-12 lg:col-span-9">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
