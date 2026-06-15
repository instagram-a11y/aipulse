import { NextResponse } from 'next/server'
import { contactSchema } from '@/lib/validations'
import { createServiceClient } from '@/lib/supabase/server'

const TO_EMAIL = 'hello@aipulse.ca'
const FROM_EMAIL = 'AIPulse <noreply@aipulse.ca>'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', issues: parsed.error.flatten() }, { status: 400 })
  }

  const { name, email, company, message, language } = parsed.data

  // Send via Resend REST API if configured; otherwise log (dev mode).
  const apiKey = process.env.RESEND_API_KEY
  if (apiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [TO_EMAIL],
          reply_to: email,
          subject: `New contact form message from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || '—'}\nLanguage: ${language}\n\n${message}`,
        }),
      })
      if (!res.ok) {
        console.error('Resend error', await res.text())
        return NextResponse.json({ error: 'Email send failed' }, { status: 502 })
      }
    } catch (err) {
      console.error('Resend request failed', err)
      return NextResponse.json({ error: 'Email send failed' }, { status: 502 })
    }
  } else {
    console.log('[contact] (no RESEND_API_KEY set) message received:', {
      name,
      email,
      company,
      language,
      message,
    })
  }

  // Save to Supabase (non-blocking — don't fail the request if this errors)
  try {
    const supabase = await createServiceClient()
    await supabase.from('contact_submissions').insert({
      name,
      email,
      company: company || null,
      message,
      language,
    })
  } catch (err) {
    console.error('[contact] supabase insert failed:', err)
  }

  return NextResponse.json({ ok: true })
}
