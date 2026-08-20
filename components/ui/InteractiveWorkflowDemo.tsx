'use client'

import { motion } from 'framer-motion'
import { Database, Brain, Sparkles } from 'lucide-react'

export function InteractiveWorkflowDemo() {
  return (
    <div className="relative w-full h-[500px] flex items-center justify-center perspective-[1000px]">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gold/5 blur-[100px] rounded-full z-0 pointer-events-none" />

      {/* Main Glass Panel */}
      <motion.div 
        className="relative z-10 w-full max-w-[90vw] sm:max-w-sm rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl p-6 overflow-hidden"
        initial={{ rotateX: 10, rotateY: -10, opacity: 0 }}
        animate={{ rotateX: 0, rotateY: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <div className="absolute top-4 right-4 bg-gold/20 text-gold text-[10px] uppercase tracking-widest px-2 py-1 rounded border border-gold/30">
          Interactive Demo
        </div>

        <h3 className="text-white font-display text-lg mb-8">AI Workflow Engine</h3>

        {/* Nodes */}
        <div className="space-y-6 relative">
          {/* Node 1 */}
          <motion.div 
            className="flex items-center gap-4 relative z-10"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-10 h-10 rounded-full bg-deep-navy border border-white/20 flex items-center justify-center shadow-inner">
              <Database className="text-mist w-5 h-5" />
            </div>
            <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3">
              <p className="text-xs text-slate uppercase tracking-wider mb-1">Step 1: Input</p>
              <p className="text-sm text-white font-medium">Diagnose Inefficiencies</p>
            </div>
          </motion.div>

          {/* Node 2 */}
          <motion.div 
            className="flex items-center gap-4 relative z-10"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shadow-[0_0_15px_rgba(198,161,91,0.2)]">
              <Brain className="text-gold w-5 h-5" />
            </div>
            <div className="flex-1 bg-gold/5 border border-gold/20 rounded-lg p-3">
              <p className="text-xs text-gold/80 uppercase tracking-wider mb-1">Step 2: Process</p>
              <p className="text-sm text-white font-medium">Custom AI Agent Logic</p>
            </div>
          </motion.div>

          {/* Node 3 */}
          <motion.div 
            className="flex items-center gap-4 relative z-10"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="w-10 h-10 rounded-full bg-deep-navy border border-white/20 flex items-center justify-center shadow-inner">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3">
              <p className="text-xs text-slate uppercase tracking-wider mb-1">Step 3: Output</p>
              <p className="text-sm text-white font-medium">Automated CRM Action</p>
            </div>
          </motion.div>

          {/* Connecting Lines */}
          <div className="absolute top-5 left-5 w-px h-[calc(100%-40px)] bg-gradient-to-b from-white/20 via-gold to-white/20 z-0">
             <motion.div 
               className="w-[3px] h-10 bg-gold absolute -left-[1px] rounded-full shadow-[0_0_10px_#C6A15B]"
               animate={{ top: ['0%', '100%'] }}
               transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
             />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
