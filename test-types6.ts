import { useChat } from '@ai-sdk/react'

function Test() {
    const chat = useChat()
    chat.append({ role: 'user', content: 'hi' }) // This errors
    chat.sendMessage([{ role: 'user', content: 'hi' }]) // This errors
}
