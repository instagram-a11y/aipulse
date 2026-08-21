import { streamText } from 'ai'
import { google } from '@ai-sdk/google'

async function run() {
  const result = await streamText({
    model: google('gemini-flash-latest'),
    messages: [{role: "user", content: "hi"}]
  })
  console.log(Object.keys(result))
  console.log(Object.getPrototypeOf(result))
}
run().catch(console.error)
