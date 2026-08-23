'use client'

import { useState } from 'react'

import { PulseCrest } from '@/components/PulseCrest'
import { FadeUp } from '@/components/FadeUp'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        // Force hard refresh to ensure middleware picks up the new cookie
        window.location.href = window.location.pathname.replace('/login', '')
      } else {
        const data = await res.json()
        setError(data.error || 'Invalid password')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-deep-navy min-h-screen flex items-center justify-center px-6 py-32">
      <FadeUp className="w-full max-w-sm text-center">
        <div className="flex justify-center mb-8">
          <PulseCrest size={56} animate={false} />
        </div>
        <h1 className="font-display font-light text-white text-3xl mb-3">Admin Access</h1>
        <div className="w-10 h-px bg-gold mx-auto mb-8" />
        
        <form onSubmit={handleSubmit} className="bg-ink-navy border border-gold/20 p-8 rounded-xl shadow-2xl">
          <p className="text-sm text-slate leading-relaxed mb-6">
            Enter your passcode to access the CRM and lead management dashboard.
          </p>

          <div className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter passcode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-deep-navy border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors text-center tracking-widest"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-deep-navy font-semibold tracking-widest uppercase text-sm py-3 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Access Dashboard'}
            </button>
          </div>
        </form>
      </FadeUp>
    </section>
  )
}
