
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Calendar as CalendarIcon, BookOpen, Clock, CheckCircle2, ChevronRight, Layout } from 'lucide-react';
import { getMentorResponse, generateStudyPlan } from '../geminiService';
import { ChatMessage, StudyPlanItem } from '../types';

const Mentor: React.FC = () => {
  const [view, setView] = useState<'Chat' | 'Plan'>('Chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hi! I am Mentor. Send me your exam dates and I will build your roadmap. Ready to start?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [studyPlan, setStudyPlan] = useState<StudyPlanItem[]>([]);
  const [pendingPlan, setPendingPlan] = useState<StudyPlanItem[] | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const lowerInput = inputValue.toLowerCase();
    const userMsg: ChatMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Confirmation logic
    if (pendingPlan && (lowerInput.includes('yes') || lowerInput.includes('add it') || lowerInput.includes('sure'))) {
        setStudyPlan(pendingPlan);
        setPendingPlan(null);
        setMessages(prev => [...prev, { role: 'assistant', content: "Done! I have synced the plan to your Roadmap tab. Anything else?" }]);
        setIsTyping(false);
        return;
    }

    if (lowerInput.includes('plan') || lowerInput.includes('exam')) {
        const plan = await generateStudyPlan(['Economics', 'History'], ['Nov 20']);
        setPendingPlan(plan);
        setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: "I have drafted a plan for Economics and History. Should I add this to your calendar?" 
        }]);
        setIsTyping(false);
        return;
    }

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
        <div className="bg-white p-2 rounded-[2rem] flex shadow-xl border border-slate-50 md:w-72">
          {(['Chat', 'Plan'] as const).map(t => (
            <button
              key={t}
              onClick={() => setView(t)}
              className={`flex-1 py-4 text-xs font-black rounded-[1.5rem] transition-all duration-300 uppercase tracking-widest ${
                view === t ? 'bg-slate-900 text-white shadow-2xl' : 'text-slate-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {view === 'Chat' ? (
            <motion.div key="chat" className="h-full flex flex-col">
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
                    placeholder="Type your message here..."
                    className="flex-1 bg-transparent border-none outline-none text-lg px-8 py-3 font-bold text-slate-800"
                  />
                  <button onClick={handleSend} className="bg-slate-900 text-white p-5 rounded-[2rem] shadow-2xl transition-transform active:scale-95">
                    <Send size={24} />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="plan" className="h-full overflow-y-auto p-10 pb-40 scrollbar-hide">
              {studyPlan.length > 0 ? (
                <div className="max-w-5xl mx-auto space-y-8">
                  <h2 className="text-3xl font-black text-slate-900 mb-10">Synced Study Roadmap</h2>
                  <div className="grid gap-8">
                    {studyPlan.map((item) => (
                      <div key={item.id} className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-50 flex flex-col md:flex-row gap-10 items-start">
                        <div className="w-32 flex-shrink-0">
                           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.time}</span>
                           <div className={`w-14 h-14 mt-4 rounded-2xl flex items-center justify-center font-black text-white ${item.difficulty > 3 ? 'bg-orange-500' : 'bg-green-500'}`}>
                             {item.difficulty}
                           </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-black text-slate-900 mb-4">{item.subject}</h3>
                          <div className="space-y-4">
                            {item.tasks.map((t, i) => (
                              <div key={i} className="flex items-center gap-4 text-slate-500 font-bold">
                                <div className="w-2 h-2 rounded-full bg-slate-200" />
                                {t}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-48 h-48 bg-white rounded-[4rem] flex items-center justify-center mb-10 shadow-inner">
                    <Layout size={80} className="text-slate-100" />
                  </div>
                  <h3 className="text-4xl font-black text-slate-800 mb-4">No Roadmap Active</h3>
                  <p className="text-slate-400 max-w-sm mb-12 font-bold leading-relaxed">Chat with Mentor to build a schedule and add it to your calendar.</p>
                  <button onClick={() => setView('Chat')} className="px-12 py-6 bg-slate-900 text-white rounded-[2.5rem] font-black shadow-2xl">START CHATTING</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Mentor;
