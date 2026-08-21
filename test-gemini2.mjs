import { google } from '@ai-sdk/google'
import { streamText } from 'ai'
import { z } from 'zod'

async function run() {
  const result = streamText({
    model: google('gemini-1.5-flash'),
    messages: [
      { role: "assistant", content: "hi" },
      { role: "user", content: "سلام" }
    ]
  });

  try {
    for await (const chunk of result.fullStream) {
      console.log(chunk);
    }
  } catch (e) {
    console.error("CAUGHT ERROR:", e);
  }
}

run().catch(console.error)
