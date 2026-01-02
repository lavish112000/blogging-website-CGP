import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'
import { verifyManageToken } from '@/lib/subscriberTokens'
import { sendUnsubscribedEmail } from '@/lib/subscriberEmails'
import { getRequestBaseUrl } from '@/lib/siteUrl'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
        <head><title>Invalid Link</title></head>
        <body style="font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;text-align:center;padding:2rem">
          <h1>Invalid link</h1>
          <p>This link is missing a token.</p>
        </body>
        </html>
        `,
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      )
    }

    const subscriberId = verifyManageToken(token)
    if (!subscriberId) {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
        <head><title>Invalid Token</title></head>
        <body style="font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;text-align:center;padding:2rem">
          <h1>Invalid token</h1>
          <p>This link is not valid.</p>
        </body>
        </html>
        `,
        { status: 403, headers: { 'Content-Type': 'text/html' } }
      )
    }

    await connectDB()

    const subscriber = await Subscriber.findById(subscriberId)
    if (!subscriber) {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
        <head><title>Not Found</title></head>
        <body style="font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;text-align:center;padding:2rem">
          <h1>Subscriber not found</h1>
        </body>
        </html>
        `,
        { status: 404, headers: { 'Content-Type': 'text/html' } }
      )
    }

    const statusText =
      subscriber.status === 'active'
        ? '✅ Active'
        : subscriber.status === 'pending'
        ? '⏳ Pending confirmation'
        : '❌ Unsubscribed'

    const baseUrl = getRequestBaseUrl(new Headers(request.headers))
    const unsubUrl = `${baseUrl}/api/subscribers/manage?token=${token}&action=unsubscribe`

    return new Response(
      `
      <!DOCTYPE html>
      <html>
      <head><title>Manage Subscription</title></head>
      <body style="font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;max-width:600px;margin:2rem auto;padding:1rem">
        <h1>Manage Subscription</h1>
        <p><strong>Email:</strong> ${subscriber.email}</p>
        <p><strong>Status:</strong> ${statusText}</p>
        ${
          subscriber.status === 'active'
            ? `<p style="margin-top:2rem">
                <a href="${unsubUrl}" style="display:inline-block;padding:0.5rem 1rem;background:#ef4444;color:white;text-decoration:none;border-radius:0.375rem">Unsubscribe</a>
              </p>`
            : ''
        }
        <p style="margin-top:2rem"><a href="/" style="color:#0070f3">Go to homepage</a></p>
      </body>
      </html>
      `,
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    )
  } catch (error) {
    console.error('Manage subscription error:', error)
    return new Response(
      `
      <!DOCTYPE html>
      <html>
      <head><title>Error</title></head>
      <body style="font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;text-align:center;padding:2rem">
        <h1>Something went wrong</h1>
        <p>Please try again later.</p>
      </body>
      </html>
      `,
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const action = searchParams.get('action')

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 })
    }

    const subscriberId = verifyManageToken(token)
    if (!subscriberId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
    }

    await connectDB()

    const subscriber = await Subscriber.findById(subscriberId)
    if (!subscriber) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 })
    }

    if (action === 'unsubscribe') {
      if (subscriber.status === 'unsubscribed') {
        return NextResponse.json({ message: 'Already unsubscribed' }, { status: 200 })
      }

      subscriber.status = 'unsubscribed'
      subscriber.unsubscribedAt = new Date()
      await subscriber.save()

      const baseUrl = getRequestBaseUrl(new Headers(request.headers))
      const resubscribeUrl = `${baseUrl}/newsletter`

      await sendUnsubscribedEmail({
        to: subscriber.email,
        resubscribeUrl,
      })

      return new Response(
        `
        <!DOCTYPE html>
        <html>
        <head><title>Unsubscribed</title></head>
        <body style="font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;text-align:center;padding:2rem">
          <h1>✅ Unsubscribed</h1>
          <p>You have been unsubscribed successfully.</p>
          <p style="margin-top:2rem"><a href="/" style="color:#0070f3">Go to homepage</a></p>
        </body>
        </html>
        `,
        { status: 200, headers: { 'Content-Type': 'text/html' } }
      )
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
