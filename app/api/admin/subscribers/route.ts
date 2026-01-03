import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'
import { checkAdminAuth } from '@/lib/auth'

export async function GET(req: Request) {
  const auth = await checkAdminAuth(new Headers(req.headers))

  if (!auth.authorized) {
    return NextResponse.json(
      { error: 'Unauthorized', reason: auth.reason || 'Not authorized' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const format = searchParams.get('format')

    await connectDB()

    const filter: { status?: string } = {}
    if (status && ['active', 'pending', 'unsubscribed'].includes(status)) {
      filter.status = status
    }

    const subscribers = await Subscriber.find(filter).sort({ createdAt: -1 }).lean()

    const counts = {
      total: await Subscriber.countDocuments(),
      active: await Subscriber.countDocuments({ status: 'active' }),
      pending: await Subscriber.countDocuments({ status: 'pending' }),
      unsubscribed: await Subscriber.countDocuments({ status: 'unsubscribed' }),
    }

    if (format === 'csv') {
      const headers = ['Email', 'Status', 'Subscribed At', 'Confirmed At', 'Unsubscribed At']
      const rows = subscribers.map((s) => [
        s.email,
        s.status,
        s.createdAt ? new Date(s.createdAt).toISOString() : '',
        s.confirmedAt ? new Date(s.confirmedAt).toISOString() : '',
        s.unsubscribedAt ? new Date(s.unsubscribedAt).toISOString() : '',
      ])

      const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')

      return new Response(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="subscribers-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    }

    return NextResponse.json({ subscribers, counts })
  } catch (error) {
    console.error('Admin subscribers fetch failed:', error)

    const message = error instanceof Error ? error.message : ''
    if (message.includes('Missing MONGODB_URI')) {
      return NextResponse.json(
        {
          error: 'Missing MONGODB_URI',
          hint: 'Set MONGODB_URI in your environment (local: .env.local, production: Netlify Environment variables).',
        },
        { status: 500 }
      )
    }

    // Common Atlas/URI issues — keep this safe (no secrets)
    if (/Authentication failed|bad auth|auth error/i.test(message)) {
      return NextResponse.json(
        {
          error: 'MongoDB authentication failed',
          hint: 'Check Atlas DB user/password. If your password has special characters like @ or #, URL-encode them (%40, %23).',
        },
        { status: 500 }
      )
    }

    if (/ENOTFOUND|querySrv ENOTFOUND|getaddrinfo ENOTFOUND/i.test(message)) {
      return NextResponse.json(
        {
          error: 'MongoDB host not found',
          hint: 'Double-check the cluster host in your MONGODB_URI (copy it from Atlas “Connect → Drivers”).',
        },
        { status: 500 }
      )
    }

    if (/IP.*not allowed|not authorized on|ECONNREFUSED|ETIMEDOUT/i.test(message)) {
      return NextResponse.json(
        {
          error: 'MongoDB connection blocked',
          hint: 'In Atlas Network Access, allow your current IP (or temporarily allow 0.0.0.0/0 for testing).',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const auth = await checkAdminAuth(new Headers(req.headers))

  if (!auth.authorized) {
    return NextResponse.json(
      { error: 'Unauthorized', reason: auth.reason || 'Not authorized' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing subscriber id' }, { status: 400 })
    }

    await connectDB()

    const result = await Subscriber.findByIdAndDelete(id)

    if (!result) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Subscriber deleted' })
  } catch (error) {
    console.error('Admin subscriber delete failed:', error)

    const message = error instanceof Error ? error.message : ''
    if (message.includes('Missing MONGODB_URI')) {
      return NextResponse.json(
        {
          error: 'Missing MONGODB_URI',
          hint: 'Set MONGODB_URI in your environment (local: .env.local, production: Netlify Environment variables).',
        },
        { status: 500 }
      )
    }

    if (/Authentication failed|bad auth|auth error/i.test(message)) {
      return NextResponse.json(
        {
          error: 'MongoDB authentication failed',
          hint: 'Check Atlas DB user/password. If your password has special characters like @ or #, URL-encode them (%40, %23).',
        },
        { status: 500 }
      )
    }

    if (/ENOTFOUND|querySrv ENOTFOUND|getaddrinfo ENOTFOUND/i.test(message)) {
      return NextResponse.json(
        {
          error: 'MongoDB host not found',
          hint: 'Double-check the cluster host in your MONGODB_URI (copy it from Atlas “Connect → Drivers”).',
        },
        { status: 500 }
      )
    }

    if (/IP.*not allowed|not authorized on|ECONNREFUSED|ETIMEDOUT/i.test(message)) {
      return NextResponse.json(
        {
          error: 'MongoDB connection blocked',
          hint: 'In Atlas Network Access, allow your current IP (or temporarily allow 0.0.0.0/0 for testing).',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
