import { createServiceClient } from '@/lib/supabase/server'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { MessageSquare, Briefcase, ExternalLink, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const isRtl = locale === 'fa'
  const supabase = await createServiceClient()

  // Fetch data
  const { data: contacts, error: contactsError } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  const { data: leads, error: leadsError } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (contactsError) console.error('Error fetching contacts:', contactsError)
  if (leadsError) console.error('Error fetching leads:', leadsError)

  return (
    <div className={`min-h-screen bg-deep-navy text-white pt-24 pb-12 px-6 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl lg:text-4xl font-display font-light mb-2">Admin Dashboard</h1>
          <p className="text-slate text-sm">View recent contact submissions and generated AI proposals.</p>
        </header>

        <div className="space-y-16">
          {/* Leads / Proposals Section */}
          <section>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <Briefcase className="w-6 h-6 text-gold" />
              <h2 className="text-2xl font-display">Generated Proposals (Leads)</h2>
            </div>
            
            {(!leads || leads.length === 0) ? (
              <p className="text-slate italic">No proposals generated yet.</p>
            ) : (
              <div className="grid gap-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="bg-ink-navy border border-white/5 p-6 rounded-xl hover:border-gold/30 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{lead.name}</h3>
                        <p className="text-slate text-sm">{lead.email} {lead.phone ? `| ${lead.phone}` : ''}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(lead.created_at).toLocaleDateString()}
                        </span>
                        <Link href={`/proposal/${lead.id}`} target="_blank" className="bg-gold text-deep-navy text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-2 hover:bg-white transition-colors">
                          View Proposal <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                    <div className="bg-deep-navy p-4 rounded border border-white/5 text-sm text-slate-100">
                      <strong>Project Details:</strong> {lead.project_details}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Contact Submissions Section */}
          <section>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <MessageSquare className="w-6 h-6 text-gold" />
              <h2 className="text-2xl font-display">Contact Form Messages</h2>
            </div>
            
            {(!contacts || contacts.length === 0) ? (
              <p className="text-slate italic">No messages received yet.</p>
            ) : (
              <div className="grid gap-4">
                {contacts.map((msg) => (
                  <div key={msg.id} className="bg-ink-navy border border-white/5 p-6 rounded-xl hover:border-gold/30 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{msg.name}</h3>
                        <p className="text-slate text-sm">{msg.email} {msg.company ? `| ${msg.company}` : ''}</p>
                      </div>
                      <span className="text-xs text-slate flex items-center gap-1 shrink-0">
                        <Calendar className="w-3 h-3" />
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="bg-deep-navy p-4 rounded border border-white/5 text-sm text-slate-100 whitespace-pre-wrap">
                      {msg.message}
                    </div>
                    {msg.language && (
                      <div className="mt-3 text-xs text-slate border border-white/10 inline-block px-2 py-1 rounded">
                        Lang: {msg.language}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
