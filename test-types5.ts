import { useChat } from '@ai-sdk/react'

function Test() {
    const chat = useChat()
    type SendMessageType = typeof chat.sendMessage;
    const x: SendMessageType = null as any;
}
