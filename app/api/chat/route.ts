import { google } from '@ai-sdk/google'
import { streamText, tool, generateId } from 'ai'
import { z } from 'zod'
import { saveLeadAndNotify, type LeadData } from '@/lib/saveLead'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const body = await req.json();
  const { messages } = body
  
  const convertedMessages = messages.map((m: { role: string; content?: string; parts?: { text: string }[] }) => {
    let text = m.content;
    if (!text && m.parts) {
      text = m.parts.map((p) => p.text).join('');
    }
    return {
      id: m.id,
      role: m.role as "user" | "assistant" | "system" | "data",
      content: text || ""
    };
  });
  console.log("Converted messages:", Array.isArray(convertedMessages), convertedMessages);

  try {
    const result = streamText({
      model: google('gemini-3.6-flash'),
      messages: convertedMessages,
      system: `You are the AI Business Consultant for AI Pulse.
      AI Pulse helps businesses identify and implement AI solutions, AI agents, workflow automation, integrations, and custom AI systems.
      Your primary role is to conduct an intelligent discovery conversation with a potential client.
      
      Understand:
      - what their business does
      - their industry
      - what problem they are trying to solve
      - what processes are currently manual
      - what takes too much employee time
      - how customers currently contact them
      - what software or CRM they use
      - whether they use WhatsApp, email, phone, website chat, social media, or other channels
      - approximate volume of work, leads, customers, messages, calls, documents, or transactions when relevant
      - what outcome they want
      - what integrations may be required
      - language requirements
      - timeline
      - approximate project scope
      - contact information when appropriate
      
      RULES:
      1. Respond in the exact language the user is speaking.
      2. Do NOT ask the user a long questionnaire. Have a natural conversation.
      3. Ask only one or two useful questions at a time. Every next question should be based on information already provided.
      4. Never repeat a question the user already answered. Do not ask irrelevant questions just to fill fields.
      5. You are also an AI solutions consultant. When helpful, explain what kind of AI solution may fit their situation (e.g. AI agents, CRM automation, document processing, etc).
      6. Do not invent capabilities. Do not promise integrations before understanding the systems involved. Keep answers professional, concise, consultative, and natural.
      7. Once you have gathered enough information (name, contact info, and business requirements), you MUST call the "generateProposal" tool. Do not ask the user for permission to generate it, just generate it.
      8. After the tool returns the proposalId, you MUST give the user this link to view their proposal: \`https://aipulse.ca/proposal/\${proposalId}\` (or the equivalent local link: \`/proposal/\${proposalId}\`).
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

    
return result.toUIMessageStreamResponse();

  } catch (error: unknown) {
    console.error("API error", error);
    return new Response(error instanceof Error ? error.stack || error.message : "Internal Server Error", { status: 500 });
  }
}
