const fs = require('fs');
let code = fs.readFileSync('components/ui/ConsultationChatbot.tsx', 'utf8');

code = code.replace(
  "const hasToolCall = msg.parts.some((p: { type?: string; text?: string; content?: string }) => p.type === 'tool-invocation' || p.type === 'tool-call');",
  "const hasToolCall = msg.parts.some((p: unknown) => (p as { type?: string }).type === 'tool-invocation' || (p as { type?: string }).type === 'tool-call');"
);

code = code.replace(
  "return msg.parts.map((p: { type?: string; text?: string; content?: string }) => p.text || p.content || '').join('');",
  "return msg.parts.map((p: unknown) => (p as { text?: string; content?: string }).text || (p as { text?: string; content?: string }).content || '').join('');"
);

fs.writeFileSync('components/ui/ConsultationChatbot.tsx', code);
