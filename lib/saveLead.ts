import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { nanoid } from 'nanoid'

export interface LeadData {
  name: string
  email: string
  phone: string
  projectDetails: string
  requiredDataFromClient: string[]
  deliverables: string[]
  executionSteps: string[]
  language: string
}

export async function saveLeadAndNotify(data: LeadData) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  )
  const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')
  const proposalId = nanoid(10)
  
  // 1. Save to Supabase
  try {
    const { error } = await supabase.from('leads').insert([
      {
        id: proposalId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        project_details: data.projectDetails,
        required_data: data.requiredDataFromClient,
        deliverables: data.deliverables,
        execution_steps: data.executionSteps,
        language: data.language,
        created_at: new Date().toISOString()
      }
    ])
    if (error) console.error('Supabase Error:', error)
  } catch (e) {
    console.error('Failed to save to Supabase:', e)
  }

  // 2. Send Email to Admin (Golnaz)
  try {
    await resend.emails.send({
      from: 'AIPulse Bot <bot@aipulse.ca>',
      to: ['golnaz.resalei@gmail.com'], // Or the correct email
      subject: `New AI Project Lead: ${data.name}`,
      html: `
        <h2>New Project Consultation</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Language:</strong> ${data.language}</p>
        <hr/>
        <h3>Project Details</h3>
        <p>${data.projectDetails}</p>
        <hr/>
        <a href="https://aipulse.ca/en/proposal/${proposalId}">View Full Proposal Webpage</a>
      `
    })
  } catch (e) {
    console.error('Failed to send email:', e)
  }

  return proposalId
}
