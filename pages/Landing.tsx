
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, ShieldCheck, ChevronRight, Users, Globe, BookOpen } from 'lucide-react';

interface LandingProps {
  onLogin: () => void;
}

const Landing: React.FC<LandingProps> = ({ onLogin }) => {
  return (
    <div className="bg-white min-h-screen overflow-x-hidden selection:bg-purple-200">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Sparkles size={20} />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">CampusFlow</span>
        </div>
        <button onClick={onLogin} className="hidden md:block font-bold text-slate-900 hover:text-purple-600 transition-colors">Log In</button>
        <button onClick={onLogin} className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all">Get Started</button>
      </nav>

      {/* Hero Section */}
      <section className="px-8 pt-20 pb-32 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            Everything in one flow
          </span>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] mb-8">
            The Hub for <span className="text-purple-600">Smart</span> Students.
          </h1>
          <p className="text-xl text-slate-500 mb-12 max-w-lg font-medium leading-relaxed">
            CampusFlow connects you to events, provides AI-driven mentorship, and ensures your voice is heard anonymously.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onLogin}
              className="px-10 py-5 bg-purple-600 text-white rounded-full font-black text-lg shadow-2xl shadow-purple-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Get Started <ChevronRight size={20} />
            </button>
            <button className="px-10 py-5 border-2 border-slate-100 text-slate-900 rounded-full font-black text-lg hover:bg-slate-50 transition-all">
              Watch Demo
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="w-full aspect-square bg-gradient-to-br from-purple-100 to-blue-50 rounded-[4rem] flex items-center justify-center shadow-inner overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" 
              className="w-full h-full object-cover mix-blend-multiply opacity-80" 
              alt="Students"
            />
          </div>
          {/* Floating UI elements */}
          <div className="absolute top-10 -left-10 bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-50 flex items-center gap-4 animate-bounce duration-[4s]">
             <div className="bg-green-500 text-white p-2 rounded-xl"><Zap size={20}/></div>
             <div>
               <p className="font-black text-sm">New Event!</p>
               <p className="text-xs text-slate-400">Hackathon registration open.</p>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Powerful Features</h2>
            <p className="text-slate-500 font-medium">Designed by students, for students.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="text-orange-500" />} 
              title="Pulse Events" 
              desc="Real-time campus event feed. Register in one tap and never miss out again."
            />
            <FeatureCard 
              icon={<Sparkles className="text-purple-500" />} 
              title="Mentor AI" 
              desc="Connected to Gemini. Real study plans, academic advice, and deep learning assistance."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-green-500" />} 
              title="Echo Reporting" 
              desc="Anonymous community feedback. Improving campus life, one report at a time."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-4 gap-12">
          <Stat value="12k+" label="Active Students" />
          <Stat value="50+" label="Colleges Integrated" />
          <Stat value="500+" label="Events Daily" />
          <Stat value="99%" label="Problem Resolved" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-20 text-white px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white">
              <Sparkles size={20} />
            </div>
            <span className="text-xl font-black tracking-tight">CampusFlow</span>
          </div>
          <div className="flex gap-10 text-slate-400 font-bold text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
          <p className="text-slate-500 text-xs">© 2024 CampusFlow Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-purple-100/30 transition-all hover:-translate-y-2">
    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <h3 className="text-2xl font-black text-slate-900 mb-4">{title}</h3>
    <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

const Stat = ({ value, label }: any) => (
  <div className="text-center">
    <p className="text-5xl font-black text-slate-900 mb-2">{value}</p>
    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{label}</p>
  </div>
);

export default Landing;
