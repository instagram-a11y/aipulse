'use client'
import Cal, { getCalApi } from '@calcom/embed-react'
import { useEffect } from 'react'

export function CalEmbed() {
  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi({ namespace: '30min' })
      cal('ui', {
        styles: { branding: { brandColor: '#C9A84C' } },
        hideEventTypeDetails: false,
        layout: 'month_view',
      })
    })()
  }, [])

  return (
    <Cal
      namespace="30min"
      calLink="aipulse/30min"
      style={{ width: '100%', height: '100%', overflow: 'scroll' }}
      config={{ layout: 'month_view' }}
    />
  )
}
