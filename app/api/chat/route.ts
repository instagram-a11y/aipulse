
import { google } from '@ai-sdk/google'
import { streamText, tool } from 'ai'
import { z } from 'zod'
import { saveLeadAndNotify, type LeadData } from '@/lib/saveLead'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    messages,
    system: `You are an expert AI Consultant working for "AI Pulse", a luxury AI agency based in Canada. 
    Your goal is to talk to potential clients, understand their business, and gather enough requirements to propose a custom AI solution.
    
    CRITICAL RULES:
    1. Respond in the exact language the user is speaking (e.g. if they speak Persian, respond in Persian).
    2. Be polite, professional, and concise. Act like a top-tier consultant.
    3. Ask questions step-by-step. Do NOT ask all questions at once. 
    4. You MUST gather the following information before you can generate a proposal:
       - The user's name.
       - The user's email address or phone number (for contact).
       - What their business does.
       - What specific problem they want AI to solve (or if they want general automation/chatbots).
    5. Once you have gathered ALL the required information, you MUST call the "generateProposal" tool. Do not ask the user for permission to generate it, just generate it.
    6. When you call the tool, you must synthesize the execution steps, what data you need from them, and what deliverables you will provide.
    7. After the tool returns the proposalId, you MUST give the user this link to view their proposal: \`https://aipulse.ca/proposal/\${proposalId}\` (or the equivalent local link: \`/proposal/\${proposalId}\`).
    `,
    tools: {
      generateProposal: tool({
        description: 'Generate a final AI implementation proposal and save the lead. Call this ONLY after you have collected the user\'s name, contact info, and business requirements.',
        parameters: z.object({
          name: z.string().describe('The name of the user'),
          email: z.string().describe('The email address of the user (if provided)'),
          phone: z.string().describe('The phone number of the user (if provided)'),
          projectDetails: z.string().describe('A summary of the user\'s business and what AI solution they need'),
          requiredDataFromClient: z.array(z.string()).describe('A list of data or access required from the client to execute the project (e.g., "Access to CRM API", "Historical sales data in CSV")'),
          deliverables: z.array(z.string()).describe('A list of deliverables AI Pulse will provide (e.g., "Custom AI Chatbot trained on your data", "Automated email workflow")'),
          executionSteps: z.array(z.string()).describe('A step-by-step plan of how AI Pulse will execute the project (e.g., "1. Data Audit, 2. Model Training...")'),
          language: z.string().describe('The language the user is speaking in (e.g., "fa" for Persian, "en" for English)')
        }),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        execute: async (args: LeadData) => {
          // This saves to the DB and emails Golnaz
          const proposalId = await saveLeadAndNotify(args)
          return { proposalId, success: true }
        }
      })
    }
  })

  return result.toTextStreamResponse()
}
