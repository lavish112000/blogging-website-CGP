import connectDB from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'
import { sha256 } from '@/lib/subscriberTokens'

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
          <h1>Invalid confirmation link</h1>
          <p>This link is missing a token. Please use the link from your email.</p>
        </body>
        </html>
        `,
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      )
    }

    await connectDB()

    const tokenHash = sha256(token)
    const subscriber = await Subscriber.findOne({ confirmTokenHash: tokenHash })

    if (!subscriber) {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
        <head><title>Invalid Token</title></head>
        <body style="font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;text-align:center;padding:2rem">
          <h1>Invalid or expired token</h1>
          <p>This confirmation link is not valid. Please request a new confirmation email.</p>
        </body>
        </html>
        `,
        { status: 404, headers: { 'Content-Type': 'text/html' } }
      )
    }

    if (subscriber.confirmTokenExpiresAt && subscriber.confirmTokenExpiresAt < new Date()) {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
        <head><title>Token Expired</title></head>
        <body style="font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;text-align:center;padding:2rem">
          <h1>Confirmation link expired</h1>
          <p>This link has expired. Please request a new confirmation email.</p>
        </body>
        </html>
        `,
        { status: 410, headers: { 'Content-Type': 'text/html' } }
      )
    }

    if (subscriber.status === 'active') {
      return new Response(
        `
        <!DOCTYPE html>
        <html>
        <head><title>Already Confirmed</title></head>
        <body style="font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;text-align:center;padding:2rem">
          <h1>✅ Already subscribed</h1>
          <p>Your email is already confirmed. You're all set!</p>
        </body>
        </html>
        `,
        { status: 200, headers: { 'Content-Type': 'text/html' } }
      )
    }

    subscriber.status = 'active'
    subscriber.confirmedAt = new Date()
    subscriber.confirmTokenHash = undefined
    subscriber.confirmTokenExpiresAt = undefined

    await subscriber.save()

    return new Response(
      `
      <!DOCTYPE html>
      <html>
      <head><title>Subscription Confirmed</title></head>
      <body style="font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;text-align:center;padding:2rem">
        <h1>✅ Subscription confirmed!</h1>
        <p>Thank you for subscribing. You'll now receive our updates.</p>
        <p style="margin-top:2rem"><a href="/" style="color:#0070f3">Go to homepage</a></p>
      </body>
      </html>
      `,
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    )
  } catch (error) {
    console.error('Confirmation error:', error)
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
