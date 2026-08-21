'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '@ai-sdk/react'

export function ConsultationChatbot({ isRtl }: { isRtl: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const defaultWelcomeMessage = {
    id: 'welcome-message',
    role: 'assistant',
    content: isRtl
      ? 'سلام! من مشاور هوش مصنوعی AI Pulse هستم. چطور می‌تونم برای توسعه و پیاده‌سازی راهکارهای هوش مصنوعی به کسب‌وکار شما کمک کنم؟'
      : 'Hello! I am the AI Pulse consultant. How can I help you transform your business with AI today?'
  }

  const [localInput, setLocalInput] = useState('')

  const { messages, append, isLoading, error } = useChat({
    api: '/api/chat',
    initialMessages: [defaultWelcomeMessage],
    onError: (err) => {
      console.error('Chat error:', err)
      alert(isRtl ? 'خطا در ارتباط با سرور. لطفاً تنظیمات API را بررسی کنید.' : 'Connection error. Please check your API settings.')
    }
  })

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!localInput.trim() || isLoading) return
    
    append({
      role: 'user',
      content: localInput
    })
    setLocalInput('')
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const proposalReady = messages.some(m => m.content.includes('/proposal/'))

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
                
                {messages.map((m) => (
                  <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                        m.role === 'user'
                          ? 'bg-gold text-deep-navy rounded-br-none font-medium'
                          : 'bg-white/10 text-white rounded-bl-none font-light'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                
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
                <form onSubmit={handleLocalSubmit} className="relative flex items-center" dir={isRtl ? 'rtl' : 'ltr'}>
                  <input
                    value={localInput}
                    onChange={(e) => setLocalInput(e.target.value)}
                    placeholder={isRtl ? "پیام خود را بنویسید..." : "Type your message..."}
                    className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all ${isRtl ? 'pl-12' : 'pr-12'}`}
                    disabled={proposalReady || isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !localInput.trim() || proposalReady}
                    className={`absolute ${isRtl ? 'left-2' : 'right-2'} p-2 bg-gold text-deep-navy rounded-lg hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                  >
                    <Send className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
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
