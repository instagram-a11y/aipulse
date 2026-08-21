const fs = require('fs');
let content = fs.readFileSync('components/ui/ConsultationChatbot.tsx', 'utf-8');

// 1. Add Paperclip icon
content = content.replace(
  "import { MessageSquare, X, Send, Loader2 } from 'lucide-react'",
  "import { MessageSquare, X, Send, Loader2, Paperclip, FileText } from 'lucide-react'"
);

// 2. Add selectedFile state
content = content.replace(
  "const [localInput, setLocalInput] = useState('')",
  "const [localInput, setLocalInput] = useState('')\n  const [selectedFile, setSelectedFile] = useState<{name: string, data: string, mimeType: string} | null>(null)\n  const fileInputRef = useRef<HTMLInputElement>(null)"
);

// 3. Update handleLocalSubmit
const oldSubmit = `  const handleLocalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!localInput.trim() || isLoading) return
    
    sendMessage({ text: localInput })
    setLocalInput('')
  }`;

const newSubmit = `  const handleLocalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if ((!localInput.trim() && !selectedFile) || isLoading) return
    
    const messagePayload: any = { text: localInput }
    if (selectedFile) {
      // Pass the file in parts so the backend route can pick it up
      messagePayload.parts = [{
        type: 'file',
        data: selectedFile.data,
        mimeType: selectedFile.mimeType,
        name: selectedFile.name
      }]
    }
    
    sendMessage(messagePayload)
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
  }`;

content = content.replace(oldSubmit, newSubmit);

// 4. Update UI input area
const oldInputArea = `              {/* Input Area */}
              <div className="p-4 bg-black/20 border-t border-white/10">
                <form onSubmit={handleLocalSubmit} className="relative flex items-center" dir={isRtl ? 'rtl' : 'ltr'}>
                  <input
                    value={localInput}
                    onChange={(e) => setLocalInput(e.target.value)}
                    placeholder={isRtl ? "پیام خود را بنویسید..." : "Type your message..."}
                    className={\`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all \${isRtl ? 'pl-12' : 'pr-12'}\`}
                    disabled={proposalReady || isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !localInput.trim() || proposalReady}
                    className={\`absolute \${isRtl ? 'left-2' : 'right-2'} p-2 bg-gold text-deep-navy rounded-lg hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors\`}
                  >
                    <Send className={\`w-4 h-4 \${isRtl ? 'rotate-180' : ''}\`} />
                  </button>
                </form>
              </div>`;

const newInputArea = `              {/* Input Area */}
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
                      className={\`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all \${isRtl ? 'pl-12' : 'pr-12'}\`}
                      disabled={proposalReady || isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || (!localInput.trim() && !selectedFile) || proposalReady}
                      className={\`absolute \${isRtl ? 'left-2' : 'right-2'} top-1.5 p-2 bg-gold text-deep-navy rounded-lg hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors\`}
                    >
                      <Send className={\`w-4 h-4 \${isRtl ? 'rotate-180' : ''}\`} />
                    </button>
                  </div>
                </form>
              </div>`;

content = content.replace(oldInputArea, newInputArea);

fs.writeFileSync('components/ui/ConsultationChatbot.tsx', content);
