import { NextResponse } from 'next/server'

import { checkAdminAuth } from '@/lib/auth'
import { fetchGa4Summary, isGa4Configured } from '@/lib/ga4'

export async function GET(req: Request) {
  const auth = await checkAdminAuth(new Headers(req.headers))

  if (!auth.authorized) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
        reason: auth.reason || 'Not authorized',
      },
      { status: 401 }
    )
  }

  if (!isGa4Configured()) {
    return NextResponse.json({ configured: false })
  }

  const { searchParams } = new URL(req.url)
  const rangeParam = searchParams.get('range')
  const range = rangeParam === '7d' ? '7d' : '30d'

  try {
    const summary = await fetchGa4Summary(range)
    return NextResponse.json({ configured: true, summary })
  } catch (error) {
    console.error('GA4 summary fetch failed:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Failed to fetch GA4 summary', reason: message.slice(0, 300) },
      { status: 500 }
    )
  }
}
