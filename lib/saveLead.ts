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
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
  const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()
  
  const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')
  const proposalId = nanoid(10)
  
  // 1. Save to Supabase
  try {
    if (!supabaseUrl || !supabaseKey) {
      return { error: 'Missing Supabase credentials' }
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { error, data: insertedData } = await supabase.from('leads').insert([
      {
        id: proposalId,
        name: data.name || 'Unknown',
        email: data.email || '',
        phone: data.phone || '',
        project_details: data.projectDetails || '',
        required_data: JSON.stringify(data.requiredDataFromClient || []),
        deliverables: JSON.stringify(data.deliverables || []),
        execution_steps: JSON.stringify(data.executionSteps || []),
        language: data.language || 'en',
        created_at: new Date().toISOString()
      }
    ])
    if (error) {
      console.error('Supabase Error:', error)
      return { error: error.message }
    }
    console.log('Inserted successfully:', insertedData)

  } catch (e) {
    console.error('Failed to save to Supabase:', e)
    return { error: (e as Error).message }
  }

  // 2. Send Email to Admin (Golnaz)
  try {
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'AIPulse Bot <bot@aipulse.ca>',
        to: ['resaleigolenaz@gmail.com'], // Or the correct email
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
    }
  } catch (e) {
    console.error('Failed to send email:', e)
  }

  return proposalId
}
