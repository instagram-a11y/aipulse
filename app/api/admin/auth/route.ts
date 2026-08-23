import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const correctPassword = process.env.ADMIN_PASSWORD

    if (!correctPassword) {
      console.error('ADMIN_PASSWORD is not set in environment variables.')
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }

    if (password === correctPassword) {
      // Set a secure HTTP-only cookie
      const cookieStore = cookies()
      cookieStore.set('admin_token', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })
      
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
