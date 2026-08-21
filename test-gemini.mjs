import { google } from '@ai-sdk/google'
import { streamText } from 'ai'
import { z } from 'zod'

async function run() {
  const result = streamText({
    model: google('gemini-flash-latest'),
    messages: [
      { role: "assistant", content: "سلام 👋 من مشاور هوش مصنوعی AI Pulse هستم.\n\nدرباره کسب‌وکار خود و آنچه دوست دارید با هوش مصنوعی بهبود، خودکارسازی یا بسازید به من بگویید. من کمک می‌کنم تا راه‌حل مناسب را پیدا کنید." },
      { role: "user", content: "سلام" }
    ],
    system: `You are the AI Business Consultant for AI Pulse.`,
    tools: {
        generateProposal: {
          description: 'Generate a final AI implementation proposal',
          parameters: z.object({ name: z.string() }),
          execute: async () => ({ success: true })
        }
    }
  });

  for await (const chunk of result.fullStream) {
    console.log(chunk);
  }
}

run().catch(console.error)
