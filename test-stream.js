fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: [{ role: 'user', content: 'hello' }] })
}).then(async res => {
  const reader = res.body.getReader();
  while(true) {
    const {done, value} = await reader.read();
    if(done) break;
    console.log("CHUNK:", new TextDecoder().decode(value));
  }
})
