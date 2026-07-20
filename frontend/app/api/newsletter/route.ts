import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const apiKey = process.env.BREVO_API_KEY
    const listId = process.env.BREVO_LIST_ID

    if (!apiKey || !listId) {
      console.warn('[Newsletter] BREVO_API_KEY / BREVO_LIST_ID not configured — subscriber not saved:', email)
      return NextResponse.json({ success: true })
    }

    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, listIds: [Number(listId)], updateEnabled: true }),
    })

    // Brevo returns 400 "duplicate_parameter" if the contact already exists —
    // that's a successful subscribe from the reader's point of view, not an error.
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      if (body?.code !== 'duplicate_parameter') {
        console.error('[Newsletter] Brevo error:', res.status, body)
        return NextResponse.json({ error: 'Could not subscribe right now' }, { status: 502 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Newsletter] Unexpected error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
