'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Loader2, Paperclip, FileText } from 'lucide-react'
type ChatMsg = { id: string; role: string; content?: string; text?: string; parts?: unknown[] };
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '@ai-sdk/react'

export function ConsultationChatbot({ isRtl }: { isRtl: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const defaultWelcomeMessage = {
    id: 'welcome-message',
    role: 'assistant',
    content: isRtl
      ? 'سلام 👋 من مشاور هوش مصنوعی AI Pulse هستم.\n\nدرباره کسب‌وکار خود و آنچه دوست دارید با هوش مصنوعی بهبود، خودکارسازی یا بسازید به من بگویید. من کمک می‌کنم تا راه‌حل مناسب را پیدا کنید.'
      : "Hi 👋 I'm the AI Pulse AI Consultant.\n\nTell me about your business and what you'd like to improve, automate, or build with AI. I'll help you identify the right solution."
  }

  const [localInput, setLocalInput] = useState('')
  const [selectedFile, setSelectedFile] = useState<{name: string, data: string, mimeType: string} | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const chat = useChat({
    // @ts-expect-error ignore api typing
    api: '/api/chat',
    initialMessages: [defaultWelcomeMessage],
    onError: (err) => {
      console.error('Chat error:', err)
      const errorMsg = `Error: ${err.message || 'Unknown error'}. Cause: ${err.cause || 'No cause'}. Stack: ${err.stack || 'No stack'}`
      // @ts-expect-error - overriding strict types
      chat.setMessages((prev: ChatMsg[]) => [
        ...prev,
        { id: Date.now().toString(), role: 'assistant', text: errorMsg, parts: [{type: 'text', text: errorMsg}] }
      ])
    }
  })
  
  console.log('chat object keys:', Object.keys(chat));
  const messages = chat.messages
  const status = chat.status
  const sendMessage = chat.sendMessage

  const isLoading = status === 'submitted' || status === 'streaming'

  const handleLocalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if ((!localInput.trim() && !selectedFile) || isLoading) return
    
    const messagePayload: { text: string; parts?: { type: string; data: string; mimeType: string; name: string }[] } = { text: localInput }
    if (selectedFile) {
      // Pass the file in parts so the backend route can pick it up
      messagePayload.parts = [{
        type: 'file',
        data: selectedFile.data,
        mimeType: selectedFile.mimeType,
        name: selectedFile.name
      }]
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendMessage(messagePayload as any)
    setLocalInput('')
    setSelectedFile(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64Data = event.target?.result as string
      // base64Data looks like: data:image/png;base64,iVBORw0KGgo...
      // we need to split it at the comma for Gemini if we use inlineData, or keep it whole.
      // Usually, just sending the whole Data URL is easiest.
      setSelectedFile({
        name: file.name,
        data: base64Data,
        mimeType: file.type
      })
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    console.log("Current Chat Messages State:", messages)
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const proposalReady = messages.some((m: ChatMsg) => (m.content || m.text || '')?.includes('/proposal/'))

  return (
    <>
      <div className={`fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} z-50`}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className={`absolute bottom-20 ${isRtl ? 'left-0' : 'right-0'} w-[350px] sm:w-[400px] h-[600px] max-h-[80vh] bg-deep-navy/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-white font-medium">AI Consultant</h3>
                    <p className="text-xs text-white/50">AI Pulse</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
                {messages.length === 0 && (
                  <div className={`flex flex-col items-start`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap bg-white/10 text-white rounded-bl-none font-light`}>
                      {defaultWelcomeMessage.content}
                    </div>
                  </div>
                )}
                
                {messages.map((m: ChatMsg) => {
                  const getMsgText = (msg: ChatMsg) => {
                    if (msg.content) return msg.content;
                    if (msg.text) return msg.text;
                    if (msg.parts && Array.isArray(msg.parts) && msg.parts.length > 0) {
                      const hasToolCall = msg.parts.some((p: unknown) => (p as { type?: string }).type === 'tool-invocation' || (p as { type?: string }).type === 'tool-call');
                      if (hasToolCall) {
                        return isRtl 
                          ? '✅ اطلاعات شما با موفقیت ثبت شد! متخصصین ما پروژه شما را بررسی کرده و به زودی برای هماهنگیِ جلسه با شما تماس خواهند گرفت.' 
                          : '✅ Your information has been successfully recorded! Our experts will review your project and contact you shortly to schedule a meeting.';
                      }
                      return msg.parts.map((p: unknown) => (p as { text?: string; content?: string }).text || (p as { text?: string; content?: string }).content || '').join('');
                    }
                    return '';
                  };
                  return (
                  <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                        m.role === 'user'
                          ? 'bg-gold text-deep-navy rounded-br-none font-medium'
                          : 'bg-white/10 text-white rounded-bl-none font-light'
                      }`}
                    >
                      {getMsgText(m)}
                    </div>
                  </div>
                )})}
                
                {messages.length === 1 && messages[0].id === 'welcome-message' && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {[
                      isRtl ? 'کسب‌وکارم را خودکار کن' : 'Automate my business',
                      isRtl ? 'یک ایجنت هوش مصنوعی بساز' : 'Build an AI agent',
                      isRtl ? 'پشتیبانی مشتریان را بهبود بده' : 'Improve customer service',
                      isRtl ? 'فروش و سرنخ‌ها را خودکار کن' : 'Automate sales & leads',
                      isRtl ? 'ایده دیگری برای هوش مصنوعی دارم' : 'I have another AI idea'
                    ].map((text, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendMessage({ text })}
                        className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/80 transition-colors"
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                )}
                
                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                  <div className="flex items-start">
                    <div className="bg-white/10 text-white/50 rounded-2xl rounded-bl-none px-4 py-3">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-black/20 border-t border-white/10">
                <AnimatePresence>
                  {selectedFile && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mb-3 p-2 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        {selectedFile.mimeType.startsWith('image/') ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={selectedFile.data} alt="preview" className="w-8 h-8 object-cover rounded" />
                        ) : (
                          <div className="w-8 h-8 bg-white/10 flex items-center justify-center rounded">
                            <FileText className="w-4 h-4 text-white/70" />
                          </div>
                        )}
                        <span className="text-xs text-white/80 truncate max-w-[200px]">{selectedFile.name}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setSelectedFile(null)}
                        className="text-white/50 hover:text-white p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <form onSubmit={handleLocalSubmit} className="relative flex items-center gap-2" dir={isRtl ? 'rtl' : 'ltr'}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf,.txt,.csv"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={proposalReady || isLoading}
                    className="p-3 bg-white/5 border border-white/10 text-white/70 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <div className="relative flex-1">
                    <input
                      value={localInput}
                      onChange={(e) => setLocalInput(e.target.value)}
                      placeholder={isRtl ? "پیام خود را بنویسید..." : "Type your message..."}
                      className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all ${isRtl ? 'pl-12' : 'pr-12'}`}
                      disabled={proposalReady || isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || (!localInput.trim() && !selectedFile) || proposalReady}
                      className={`absolute ${isRtl ? 'left-2' : 'right-2'} top-1.5 p-2 bg-gold text-deep-navy rounded-lg hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                    >
                      <Send className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 bg-gold rounded-full shadow-lg shadow-gold/20 flex items-center justify-center text-deep-navy hover:shadow-xl hover:shadow-gold/30 transition-shadow"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </motion.button>
      </div>
    </>
  )
}
