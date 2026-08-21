const fs = require('fs');
const file = 'components/ui/ConsultationChatbot.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace("import { UIMessage } from 'ai'", "type ChatMsg = { id: string; role: string; content?: string; text?: string; parts?: any[] };");
content = content.replace("messages.some((m: UIMessage)", "messages.some((m: ChatMsg)");
content = content.replace("messages.map((m: UIMessage)", "messages.map((m: ChatMsg)");
content = content.replace("{m.content}", "{m.content || m.text || ''}");
content = content.replace("m.content?.includes", "(m.content || m.text || '')?.includes");
fs.writeFileSync(file, content);
