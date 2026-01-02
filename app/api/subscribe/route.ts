import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'
import { generateConfirmToken, createManageToken } from '@/lib/subscriberTokens'
import { sendConfirmSubscriptionEmail } from '@/lib/subscriberEmails'
import { getRequestBaseUrl } from '@/lib/siteUrl'

export async function POST(request: Request) {
  try {
    // Check environment variables first
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return NextResponse.json({ error: 'Email service not configured. Please contact support.' }, { status: 500 })
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      console.error('RESEND_FROM_EMAIL is not configured')
      return NextResponse.json({ error: 'Email service not configured. Please contact support.' }, { status: 500 })
    }

    if (!process.env.SUBSCRIBER_TOKEN_SECRET) {
      console.error('SUBSCRIBER_TOKEN_SECRET is not configured')
      return NextResponse.json({ error: 'Email service not configured. Please contact support.' }, { status: 500 })
    }

    const { email } = await request.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const trimmedEmail = email.toLowerCase().trim()

    await connectDB()

    let subscriber = await Subscriber.findOne({ email: trimmedEmail })

    if (subscriber) {
      if (subscriber.status === 'active') {
        return NextResponse.json({ message: 'Already subscribed!' }, { status: 200 })
      }

      if (subscriber.status === 'unsubscribed') {
        subscriber.status = 'pending'
        subscriber.unsubscribedAt = undefined
      }

      const now = Date.now()
      const lastSent = subscriber.lastConfirmationSentAt?.getTime() || 0
      const cooldownMs = 60 * 1000

      if (now - lastSent < cooldownMs) {
        return NextResponse.json(
          { message: 'Confirmation email already sent. Please check your inbox.' },
          { status: 200 }
        )
      }
    } else {
      subscriber = new Subscriber({ email: trimmedEmail, status: 'pending' })
    }

    const { token, tokenHash, expiresAt } = generateConfirmToken()
    subscriber.confirmTokenHash = tokenHash
    subscriber.confirmTokenExpiresAt = expiresAt
    subscriber.lastConfirmationSentAt = new Date()

    await subscriber.save()

    const baseUrl = getRequestBaseUrl(new Headers(request.headers))
    const confirmUrl = `${baseUrl}/api/subscribers/confirm?token=${token}`
    const manageToken = createManageToken(subscriber._id.toString())
    const manageUrl = `${baseUrl}/api/subscribers/manage?token=${manageToken}`

    await sendConfirmSubscriptionEmail({
      to: trimmedEmail,
      confirmUrl,
      manageUrl,
    })

    return NextResponse.json(
      { message: 'Check your email to confirm your subscription!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Subscription error:', error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('RESEND_API_KEY')) {
        return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
      }
      if (error.message.includes('RESEND_FROM_EMAIL')) {
        return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
      }
      if (error.message.includes('Resend API failed')) {
        console.error('Resend API error:', error.message)
        return NextResponse.json({ error: 'Failed to send confirmation email. Please try again.' }, { status: 500 })
      }
      if (error.message.includes('MongoDB') || error.message.includes('mongoose')) {
        console.error('Database error:', error.message)
        return NextResponse.json({ error: 'Database error. Please try again.' }, { status: 500 })
      }
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
