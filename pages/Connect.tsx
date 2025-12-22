
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, MessageSquare, Briefcase, GraduationCap, Zap, Sparkles, Send, CheckCircle2, Trophy } from 'lucide-react';
import { ConnectProfile, User } from '../types';

const MOCK_PROFILES: ConnectProfile[] = [
  {
    id: 'p1',
    name: 'Troy Blaze',
    type: 'Alumni',
    stream: 'Comp Sci',
    year: 'Class of 2021',
    currentRole: 'UX Lead @ Google',
    interests: ['Product Design', 'Basketball', 'Hiking'],
    location: { x: 20, y: 30 },
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    bg: 'bg-purple-600'
  },
  {
    id: 'p2',
    name: 'Luna Sparks',
    type: 'Student',
    stream: 'Design',
    year: 'Sophomore',
    interests: ['Illustration', 'Vegan Cooking', 'Yoga'],
    location: { x: 60, y: 45 },
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    bg: 'bg-blue-400'
  },
  {
    id: 'p3',
    name: 'Milo Drift',
    type: 'Alumni',
    stream: 'Business',
    year: 'Class of 2019',
    currentRole: 'Fintech Founder',
    interests: ['Venture Capital', 'Tennis', 'Travel'],
    location: { x: 40, y: 70 },
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    bg: 'bg-rose-500'
  }
];

const Connect: React.FC<{ user: User }> = ({ user }) => {
  const [selected, setSelected] = useState<ConnectProfile | null>(null);
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());
  const [isConnecting, setIsConnecting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [activeChat, setActiveChat] = useState<ConnectProfile | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Record<string, {text: string, me: boolean}[]>>({});

  const handleConnect = (profileId: string) => {
    setIsConnecting(true);
    setTimeout(() => {
      setConnectedIds(prev => new Set(prev).add(profileId));
      setIsConnecting(false);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }, 1500);
  };

  const sendMessage = () => {
    if (!chatInput.trim() || !activeChat) return;
    const msg = { text: chatInput, me: true };
    setMessages(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), msg]
    }));
    setChatInput('');
    // Auto-reply
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [activeChat.id]: [...(prev[activeChat.id] || []), { text: "Hey! Nice to connect. Let's talk more soon!", me: false }]
      }));
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden relative bg-white">
      <div className="pt-8 md:pt-12 px-6 md:px-8 pb-6 z-10">
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">Connect</h1>
        <p className="text-sm md:text-base text-slate-400 font-bold mt-2">Find students and alumni across campus.</p>
      </div>

      {/* Discovery Map View - Improved Responsiveness */}
      <div className="flex-1 relative bg-slate-50 md:bg-transparent p-4 md:p-8">
        <div className="w-full h-full border-2 md:border-4 border-dashed border-slate-200 rounded-[2.5rem] md:rounded-[5rem] relative overflow-hidden bg-white">
           <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:30px_30px] opacity-50" />
           
           {MOCK_PROFILES.map(profile => (
             <motion.button
               key={profile.id}
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               whileHover={{ scale: 1.1, zIndex: 50 }}
               onClick={() => setSelected(profile)}
               className="absolute"
               style={{ left: `${profile.location.x}%`, top: `${profile.location.y}%` }}
             >
               <div className="relative">
                  <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] border-2 md:border-4 border-white shadow-xl overflow-hidden ${profile.bg}`}>
                    <img src={profile.avatar} className="w-full h-full object-cover" />
                  </div>
                  {connectedIds.has(profile.id) && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-lg">
                      <CheckCircle2 size={14} />
                    </div>
                  )}
               </div>
             </motion.button>
           ))}
        </div>
      </div>

      {/* Profile Detail Card Overlay */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xl" />
            <motion.div initial={{ scale: 0.8, y: 100 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 100 }} className={`relative w-full max-w-sm rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl h-[85vh] md:h-[700px] flex flex-col ${selected.bg}`}>
               <button onClick={() => setSelected(null)} className="absolute top-6 right-6 z-20 p-3 bg-black/10 text-white rounded-full"><X size={20} /></button>
               
               {/* Scrollable Content Area */}
               <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col items-center p-8 md:p-12 text-center text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border border-white/40 mb-10 mt-8">
                    <MapPin size={24} />
                  </div>
                  
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-[3rem] md:rounded-[4rem] border-6 md:border-8 border-white/20 shadow-2xl overflow-hidden bg-white/10 mb-6 flex-shrink-0">
                    <img src={selected.avatar} className="w-full h-full object-cover" />
                  </div>

                  <div className="space-y-1 mb-8">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight">{selected.name}</h2>
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] opacity-80">{selected.stream}, {selected.year}</p>
                  </div>

                  <div className="space-y-6 mb-12">
                    <h3 className="text-3xl md:text-4xl font-black leading-[0.9] tracking-tighter">
                      SHARE IT <br/> WHEN YOU <br/> <span className="text-yellow-300 italic">WANT</span> —
                    </h3>
                    {selected.currentRole ? (
                      <div className="flex items-center gap-3 bg-black/20 px-5 py-3 rounded-2xl border border-white/10">
                        <Briefcase size={16} />
                        <span className="font-bold text-xs md:text-sm">{selected.currentRole}</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 justify-center">
                        {selected.interests.map(i => (
                          <span key={i} className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest">{i}</span>
                        ))}
                      </div>
                    )}
                  </div>
               </div>

               {/* Responsive Action Bar */}
               <div className="p-4 md:p-6 bg-white m-4 rounded-[2.5rem] flex items-center gap-3 shadow-xl">
                  {connectedIds.has(selected.id) ? (
                    <button 
                      onClick={() => { setActiveChat(selected); setSelected(null); }}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest"
                    >
                      <MessageSquare size={16} /> MESSAGE
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleConnect(selected.id)}
                      disabled={isConnecting}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest disabled:opacity-50"
                    >
                      {isConnecting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Zap size={16} />
                      )}
                      {isConnecting ? 'CONNECTING...' : `CONNECT WITH ${selected.name.split(' ')[0].toUpperCase()}`}
                    </button>
                  )}
                  <button className="w-12 h-12 md:w-14 md:h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                    <Sparkles size={20} />
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Connection Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <div className="fixed inset-0 z-[150] pointer-events-none flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 100 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.5 }}
              className="bg-white px-10 py-8 rounded-[3rem] shadow-2xl border border-purple-100 flex flex-col items-center text-center gap-4"
            >
              <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center text-white shadow-xl rotate-12">
                <Trophy size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">Connection Made!</h3>
                <p className="text-slate-400 font-bold">Achievement Unlocked: Socialite</p>
              </div>
            </motion.div>
            {/* Confetti particles - CSS simulated */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, y: 0, x: 0 }}
                animate={{ 
                  opacity: 0, 
                  y: [0, -200, 400], 
                  x: [0, (i - 6) * 40, (i - 6) * 80],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 2, ease: "easeOut" }}
                className={`absolute w-4 h-4 rounded-full ${['bg-red-400', 'bg-blue-400', 'bg-yellow-400', 'bg-purple-400'][i % 4]}`}
                style={{ top: '50%', left: '50%' }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Chat Interface Modal */}
      <AnimatePresence>
        {activeChat && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveChat(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" />
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-[2.5rem] h-[80vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden">
                    <img src={activeChat.avatar} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800">{activeChat.name}</h4>
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/> Online</span>
                  </div>
                </div>
                <button onClick={() => setActiveChat(null)} className="p-2 bg-slate-50 rounded-full text-slate-400"><X size={20} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide bg-slate-50/30">
                {(messages[activeChat.id] || []).map((msg, i) => (
                  <div key={i} className={`flex ${msg.me ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-bold ${msg.me ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {(!messages[activeChat.id] || messages[activeChat.id].length === 0) && (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4">
                    <MessageSquare size={48} />
                    <p className="font-black uppercase tracking-widest text-xs">Say hello to {activeChat.name.split(' ')[0]}!</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-1 border border-slate-100">
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    className="flex-1 bg-transparent border-none outline-none py-3 text-sm font-bold text-slate-800"
                  />
                  <button onClick={sendMessage} className="p-3 bg-slate-900 text-white rounded-xl shadow-lg active:scale-90 transition-transform">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Connect;
