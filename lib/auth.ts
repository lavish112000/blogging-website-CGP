/**
 * Netlify Identity Authentication Utilities
 * Handles role-based access control for admin dashboard
 * 
 * SECURITY: Never trust client-only checks - always verify server-side
 */

export interface NetlifyUser {
  id: string
  email: string
  token?: {
    access_token?: string
    refresh_token?: string
    expires_at?: string
  }
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
  app_metadata?: {
    roles?: string[]
  }
}

function getBearerToken(headers: Headers): string | null {
  const authHeader = headers.get('authorization')
  if (!authHeader) return null

  const match = authHeader.match(/^Bearer\s+(.+)$/i)
  return match?.[1]?.trim() || null
}

function getSiteBaseUrl(headers: Headers): string | null {
  const envUrl =
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    process.env.NETLIFY_SITE_URL

  if (envUrl) return envUrl

  const host = headers.get('x-forwarded-host') || headers.get('host')
  if (!host) return null

  const proto = headers.get('x-forwarded-proto') || 'https'
  return `${proto}://${host}`
}

/**
 * Check if user has admin role
 * Admin users have full access to dashboard, analytics, and settings
 */
export function isAdmin(user: NetlifyUser | null): boolean {
  if (!user) return false
  const roles = user.app_metadata?.roles || []
  return roles.includes('admin')
}

/**
 * Check if user has editor role
 * Editors can only access CMS for content creation
 */
export function isEditor(user: NetlifyUser | null): boolean {
  if (!user) return false
  const roles = user.app_metadata?.roles || []
  return roles.includes('editor')
}

/**
 * Check if user is authenticated (any role)
 */
export function isAuthenticated(user: NetlifyUser | null): boolean {
  return user !== null && user.id !== undefined
}

/**
 * Get user's primary role
 */
export function getUserRole(user: NetlifyUser | null): 'admin' | 'editor' | 'public' {
  if (!user) return 'public'
  if (isAdmin(user)) return 'admin'
  if (isEditor(user)) return 'editor'
  return 'public'
}

/**
 * Get user display name
 */
export function getUserDisplayName(user: NetlifyUser | null): string {
  if (!user) return 'Guest'
  return user.user_metadata?.full_name || user.email || 'User'
}

/**
 * Server-side auth check result
 */
export interface AuthCheckResult {
  authorized: boolean
  user: NetlifyUser | null
  role: 'admin' | 'editor' | 'public'
  reason?: string
}

/**
 * Perform server-side authorization check
 * CRITICAL: Use this in server components and API routes
 */
export async function checkAdminAuth(headers: Headers): Promise<AuthCheckResult> {
  try {
    const token = getBearerToken(headers)

    if (!token) {
      return {
        authorized: false,
        user: null,
        role: 'public',
        reason: 'No authorization header'
      }
    }

    const baseUrl = getSiteBaseUrl(headers)
    if (!baseUrl) {
      return {
        authorized: false,
        user: null,
        role: 'public',
        reason: 'Unable to determine site URL for Identity validation'
      }
    }

    // Validate token by calling the Netlify Identity user endpoint.
    // This avoids custom JWT verification logic and ensures the token is valid.
    const resp = await fetch(`${baseUrl}/.netlify/identity/user`, {
      headers: {
        authorization: `Bearer ${token}`
      },
      cache: 'no-store'
    })

    if (!resp.ok) {
      return {
        authorized: false,
        user: null,
        role: 'public',
        reason: 'Invalid or expired token'
      }
    }

    const user = (await resp.json()) as NetlifyUser
    const role = getUserRole(user)

    if (role !== 'admin') {
      return {
        authorized: false,
        user,
        role,
        reason: 'User is not an admin'
      }
    }

    return {
      authorized: true,
      user,
      role
    }
  } catch (error) {
    console.error('Auth check failed:', error)
    return {
      authorized: false,
      user: null,
      role: 'public',
      reason: 'Authentication error'
    }
  }
}
