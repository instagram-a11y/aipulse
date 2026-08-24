const fetch = require('node-fetch');

async function run() {
  const messages = [
    { role: 'user', content: 'Hi, I run a clinic and I want an AI agent to book appointments.' },
    { role: 'assistant', content: 'That sounds like a great use case. What software do you use to manage appointments currently?' },
    { role: 'user', content: 'I use Google Calendar. Also, my name is John Doe, email is john@example.com, and phone is 1234567890. Please generate a proposal.' }
  ];

  const res = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });

  const text = await res.text();
  console.log('Response:', text);
}

run();
