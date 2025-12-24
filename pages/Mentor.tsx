import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { getMentorResponse } from '../geminiService';
import { ChatMessage } from '../types';

const Mentor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hi! I am your study assistant. Tell me what you are studying and what you find hard. I will help you with simple, clear steps." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const response = await getMentorResponse([...messages, userMsg]);
    setMessages(prev => [...prev, { role: 'assistant', content: response || "I could not think of anything. Try again?" }]);
    setIsTyping(false);
  };

  return (
    <div className="h-screen flex flex-col relative bg-transparent">
      <div className="pt-12 px-8 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-700 rounded-[2rem] flex items-center justify-center shadow-2xl">
            <Sparkles className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Mentor</h1>
            <p className="text-xs font-black text-slate-300 uppercase tracking-widest">AI Academic Success</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <motion.div className="h-full flex flex-col">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-10 pb-56 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[70%] px-10 py-7 rounded-[3.5rem] text-lg font-bold leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border-white rounded-tl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
               <div className="flex justify-start">
                 <div className="bg-white/50 px-8 py-5 rounded-[2rem] rounded-tl-none">
                   <span className="animate-pulse font-black text-slate-300 uppercase tracking-widest">Thinking...</span>
                 </div>
               </div>
            )}
          </div>
          <div className="absolute bottom-12 left-8 right-8 z-50">
            <div className="bg-white border border-slate-50 rounded-[3rem] p-4 flex items-center shadow-2xl">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your study question..."
                className="flex-1 bg-transparent border-none outline-none text-lg px-8 py-3 font-bold text-slate-800"
              />
              <button onClick={handleSend} className="bg-slate-900 text-white p-5 rounded-[2rem] shadow-2xl transition-transform active:scale-95">
                <Send size={24} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Mentor;
