import { useChat } from '@ai-sdk/react'

function Test() {
    const chat = useChat()
    chat.sendMessage({ text: 'hello' })
}
