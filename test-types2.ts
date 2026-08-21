import { useChat } from '@ai-sdk/react'

function Test() {
    const chat = useChat()
    chat.append({ role: 'user', content: 'hello' })
}
