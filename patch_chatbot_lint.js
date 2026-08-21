const fs = require('fs');
let content = fs.readFileSync('components/ui/ConsultationChatbot.tsx', 'utf-8');

// Fix any
content = content.replace(
  "const messagePayload: any = { text: localInput }",
  "const messagePayload: { text: string; parts?: { type: string; data: string; mimeType: string; name: string }[] } = { text: localInput }"
);

// Fix img -> Image (or just keep img but suppress warning if it's base64)
content = content.replace(
  "<img src={selectedFile.data} alt=\"preview\" className=\"w-8 h-8 object-cover rounded\" />",
  "/* eslint-disable-next-line @next/next/no-img-element */\n                          <img src={selectedFile.data} alt=\"preview\" className=\"w-8 h-8 object-cover rounded\" />"
);

fs.writeFileSync('components/ui/ConsultationChatbot.tsx', content);
