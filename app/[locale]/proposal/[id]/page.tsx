import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { CheckCircle2, ChevronRight, Download, Server, Briefcase, BrainCircuit } from 'lucide-react'

// Allow skipping static generation for dynamic ids
export const dynamic = 'force-dynamic'

export default async function ProposalPage({
  params: { locale, id }
}: {
  params: { locale: string; id: string }
}) {
  setRequestLocale(locale)
  const isRtl = locale === 'fa'

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: lead, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()

  const safeParseArray = (data: unknown) => {
    let arr: unknown[] = []
    if (!data) return []
    if (Array.isArray(data)) {
      arr = data
    } else if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data)
        if (Array.isArray(parsed)) arr = parsed
      } catch {
        // Not valid JSON, maybe just a regular string?
        arr = [data]
      }
    }
    
    // Ensure all items are strings to prevent React 'Objects are not valid as a child' errors
    return arr.map(item => {
      if (typeof item === 'string') return item
      if (typeof item === 'object') return JSON.stringify(item)
      return String(item)
    })
  }

  if (error || !lead) {
    notFound()
  }

  return (
    <div className={`min-h-screen bg-[#FDFBF7] text-[#1A232C] font-sans ${isRtl ? 'rtl' : 'ltr'} selection:bg-gold/30`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Print styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
        }
      `}} />

      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
        {/* Header / Letterhead */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between border-b-2 border-gold/20 pb-8 mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight mb-2">AI PULSE</h1>
            <p className="text-[#1A232C]/60 text-sm tracking-widest uppercase">
              {isRtl ? 'مشاوره و توسعه هوش مصنوعی' : 'AI Consulting & Development'}
            </p>
          </div>
          <div className="mt-6 md:mt-0 text-left md:text-right">
            <p className="text-sm font-medium">{isRtl ? 'تاریخ:' : 'Date:'} {new Date(lead.created_at).toLocaleDateString(isRtl ? 'fa-IR' : 'en-US')}</p>
            <p className="text-sm text-[#1A232C]/60">{isRtl ? 'شناسه پروپوزال:' : 'Proposal ID:'} #{lead.id}</p>
            <button 
              onClick={() => window.print()}
              className="no-print mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gold text-[#1A232C] rounded-lg text-sm font-semibold hover:bg-gold/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              {isRtl ? 'دانلود به صورت PDF' : 'Save as PDF'}
            </button>
          </div>
        </header>

        {/* Client Info */}
        <section className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-gold">
            <Briefcase className="w-6 h-6" />
            <span className="text-[#1A232C]">{isRtl ? 'اطلاعات پروژه و کارفرما' : 'Client & Project Summary'}</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-[#1A232C]/60 mb-1">{isRtl ? 'نام کارفرما' : 'Client Name'}</p>
              <p className="font-medium text-lg">{lead.name}</p>
              
              <p className="text-sm text-[#1A232C]/60 mb-1 mt-4">{isRtl ? 'اطلاعات تماس' : 'Contact Info'}</p>
              <p className="font-medium">{lead.email || '-'} {lead.phone ? `| ${lead.phone}` : ''}</p>
            </div>
            <div>
              <p className="text-sm text-[#1A232C]/60 mb-1">{isRtl ? 'خلاصه نیاز کسب‌وکار' : 'Business Need Summary'}</p>
              <p className="font-medium leading-relaxed">{lead.project_details}</p>
            </div>
          </div>
        </section>

        {/* Deliverables */}
        <section className="mb-12">
          <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
            <BrainCircuit className="w-7 h-7 text-gold" />
            {isRtl ? 'دستاوردهای پروژه (خروجی‌ها)' : 'Project Deliverables'}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {safeParseArray(lead.deliverables).map((item: string, i: number) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-gold/20 flex items-start gap-3 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="page-break" />

        {/* Execution Steps */}
        <section className="mb-12">
          <h2 className="text-2xl font-display font-bold mb-6">
            {isRtl ? 'نقشه راه و مراحل اجرا' : 'Execution Roadmap'}
          </h2>
          <div className="space-y-4">
            {safeParseArray(lead.execution_steps).map((step: string, i: number) => (
              <div key={i} className="flex items-start gap-4 bg-white p-6 rounded-xl border border-black/5 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#1A232C] text-gold flex items-center justify-center font-bold shrink-0">
                  {i + 1}
                </div>
                <div className="pt-2">
                  <p className="font-medium text-lg leading-relaxed">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Required Data */}
        <section className="mb-16">
          <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
            <Server className="w-7 h-7 text-gold" />
            {isRtl ? 'پیشنیازها و دیتای مورد نیاز از سمت شما' : 'Requirements & Data from Client'}
          </h2>
          <ul className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm space-y-4">
            {safeParseArray(lead.required_data).map((req: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-lg">
                <ChevronRight className={`w-6 h-6 text-gold shrink-0 ${isRtl ? 'rotate-180' : ''}`} />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t-2 border-black/10">
          <p className="font-display font-bold text-xl tracking-widest text-[#1A232C]">AIPULSE</p>
          <p className="text-sm text-[#1A232C]/60 mt-2">aipulse.ca | Toronto, ON, Canada</p>
        </footer>
      </main>
    </div>
  )
}
