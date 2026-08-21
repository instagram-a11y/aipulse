// Use node-fetch to simulate useChat API request
import fetch from 'node-fetch';

async function run() {
  const res = await fetch('https://aipulse.ca/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: "assistant", content: "hi" },
        { role: "user", content: "سلام" }
      ]
    })
  });
  
  console.log("STATUS:", res.status);
  const text = await res.text();
  console.log("RESPONSE:", text);
}
run().catch(console.error);
