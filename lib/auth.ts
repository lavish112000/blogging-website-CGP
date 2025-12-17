/**
 * Netlify Identity Authentication Utilities
 * Handles role-based access control for admin dashboard
 * 
 * SECURITY: Never trust client-only checks - always verify server-side
 */

export interface NetlifyUser {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
  app_metadata?: {
    roles?: string[]
  }
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
    // In production, this would validate JWT from Netlify Identity
    // For now, we'll use a placeholder that requires client-side implementation
    
    // Get authorization header
    const authHeader = headers.get('authorization')
    
    if (!authHeader) {
      return {
        authorized: false,
        user: null,
        role: 'public',
        reason: 'No authorization header'
      }
    }

    // TODO: Validate JWT token with Netlify Identity
    // const user = await validateNetlifyToken(authHeader)
    
    // Placeholder response - replace with actual JWT validation
    return {
      authorized: false,
      user: null,
      role: 'public',
      reason: 'Server-side validation not yet implemented'
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
