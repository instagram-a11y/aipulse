const fs = require('fs');
let content = fs.readFileSync('app/api/chat/route.ts', 'utf-8');

const oldMap = `  const convertedMessages = messages.map((m: { role: string; content?: string; parts?: { text: string }[] }) => {
    let text = m.content;
    if (!text && m.parts) {
      text = m.parts.map((p) => p.text).join('');
    }
    return {
      id: m.id,
      role: m.role as "user" | "assistant" | "system" | "data",
      content: text || ""
    };
  });`;

const newMap = `  const convertedMessages = messages.map((m: any) => {
    let text = m.content;
    let parts: any[] = [];
    
    if (m.parts && Array.isArray(m.parts)) {
      m.parts.forEach((p: any) => {
        if (p.type === 'text') {
          text = (text || '') + (p.text || '');
        } else if (p.type === 'file' && p.data) {
          // Client sent a base64 file string (e.g. data:image/png;base64,...)
          const dataUrl = p.data;
          let mimeType = p.mimeType;
          let base64Data = dataUrl;
          if (dataUrl.startsWith('data:')) {
            const split = dataUrl.split(',');
            mimeType = split[0].split(':')[1].split(';')[0];
            base64Data = split[1];
          }
          if (mimeType.startsWith('image/')) {
            parts.push({ type: 'image', image: base64Data, mimeType });
          } else {
            parts.push({ type: 'file', data: base64Data, mimeType });
          }
        }
      });
    }

    const finalContent = parts.length > 0 
      ? [{ type: 'text', text: text || '' }, ...parts]
      : (text || "");

    return {
      id: m.id,
      role: m.role as "user" | "assistant" | "system" | "data",
      content: finalContent
    };
  });`;

content = content.replace(oldMap, newMap);

const oldPrompt = `      5. You are also an AI solutions consultant. When helpful, explain what kind of AI solution may fit their situation (e.g. AI agents, CRM automation, document processing, etc).
      6. Do not invent capabilities. Do not promise integrations before understanding the systems involved. Keep answers professional, concise, consultative, and natural.
      7. Once you have gathered enough information (name, contact info, and business requirements), you MUST call the "generateProposal" tool. Do not ask the user for permission to generate it, just generate it.`;

const newPrompt = `      5. You are also an AI solutions consultant. When helpful, explain what kind of AI solution may fit their situation (e.g. AI agents, CRM automation, document processing, etc).
      6. Do not invent capabilities. Do not promise integrations before understanding the systems involved. Keep answers professional, concise, consultative, and natural.
      7. CRITICAL REQUIREMENT: Before generating any proposal, you MUST ask the user to provide their Name, Phone Number, and Email Address. Do not proceed until they provide this information.
      8. Once you have gathered enough information AND collected their contact details (name, phone, email), you MUST call the "generateProposal" tool. Do not ask the user for permission to generate it, just generate it.`;

content = content.replace(oldPrompt, newPrompt);

fs.writeFileSync('app/api/chat/route.ts', content);
