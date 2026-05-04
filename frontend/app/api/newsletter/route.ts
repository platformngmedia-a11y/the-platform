import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    // TODO: connect to Mailchimp / Brevo / ConvertKit
    // await fetch('https://api.brevo.com/v3/contacts', {
    //   method: 'POST',
    //   headers: {
    //     'api-key': process.env.BREVO_API_KEY!,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ email, listIds: [2], updateEnabled: true }),
    // })
    console.log('[Newsletter] New subscriber:', email)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}