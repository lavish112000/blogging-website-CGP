import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // TODO: Integrate with an Email Service Provider (ESP) here.
    // Examples: Resend, Mailchimp, ConvertKit, SendGrid.
    
    // Example integration with Resend:
    // await resend.contacts.create({
    //   email: email,
    //   firstName: 'Subscriber',
    //   unsubscribed: false,
    //   audienceId: 'YOUR_AUDIENCE_ID',
    // });

    // For now, we'll log it to the console to simulate success.
    console.log(`New subscription request: ${email}`)

    return NextResponse.json(
      { message: 'Successfully subscribed!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
