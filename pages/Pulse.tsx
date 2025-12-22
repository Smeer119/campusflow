
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Search, X, CheckCircle, Mail, ArrowRight, User as UserIcon, ShieldCheck } from 'lucide-react';
import { CampusEvent, User } from '../types';

const MOCK_EVENTS: CampusEvent[] = [

  // ===== ON-CAMPUS EVENTS (6) =====
  {
    id: 'e1',
    title: 'Hackathon 2024',
    description: 'A 24-hour coding challenge for all students. Build innovative solutions for real-world problems. Exciting prizes and internships.',
    date: 'Oct 15, 2024',
    time: '09:00 AM',
    location: 'Main Hall',
    banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000',
    isExternal: false,
    attendees: [],
  },
  {
    id: 'e2',
    title: 'TEDx University',
    description: 'Ideas worth spreading. Alumni speakers share journeys from college to successful careers in tech, art, and science.',
    date: 'Nov 02, 2024',
    time: '02:00 PM',
    location: 'Auditorium A',
    banner: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1000',
    isExternal: false,
    attendees: [],
  },
  {
    id: 'e3',
    title: 'AI & Data Science Bootcamp',
    description: 'Hands-on bootcamp covering AI, ML, and real-world data science projects with industry mentors.',
    date: 'Oct 28, 2024',
    time: '10:00 AM',
    location: 'Computer Lab 1',
    banner: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=1000',
    isExternal: false,
    attendees: [],
  },
  {
    id: 'e4',
    title: 'Startup & Entrepreneurship Meet',
    description: 'Learn how to build startups, pitch ideas, and connect with founders and investors.',
    date: 'Nov 10, 2024',
    time: '11:00 AM',
    location: 'Seminar Hall',
    banner: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000',
    isExternal: false,
    attendees: [],
  },
  {
    id: 'e5',
    title: 'UI/UX Design Workshop',
    description: 'Interactive workshop on modern UI/UX principles, Figma basics, and real project design.',
    date: 'Oct 22, 2024',
    time: '01:00 PM',
    location: 'Design Studio',
    banner: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1000',
    isExternal: false,
    attendees: [],
  },
  {
    id: 'e6',
    title: 'Annual Cultural Fest',
    description: 'Music, dance, drama, fashion show, and fun activities celebrating campus culture.',
    date: 'Dec 05, 2024',
    time: '05:00 PM',
    location: 'Open Ground',
    banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000',
    isExternal: false,
    attendees: [],
  },

  // ===== EXTERNAL EVENTS (4) =====
  {
    id: 'e7',
    title: 'National Level Hackathon',
    description: '48-hour national hackathon hosted by a tech company. Open to students across India.',
    date: 'Nov 18, 2024',
    time: '09:00 AM',
    location: 'Bangalore Tech Park',
    banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000',
    isExternal: true,
    attendees: [],
  },
  {
    id: 'e8',
    title: 'Google DevFest',
    description: 'Developer-focused conference featuring Google technologies, workshops, and networking.',
    date: 'Dec 01, 2024',
    time: '10:00 AM',
    location: 'Hyderabad Convention Center',
    banner: 'https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&q=80&w=1000',
    isExternal: true,
    attendees: [],
  },
  {
    id: 'e9',
    title: 'Tech Career Expo',
    description: 'Meet recruiters, attend resume workshops, and explore job and internship opportunities.',
    date: 'Nov 25, 2024',
    time: '09:30 AM',
    location: 'Chennai Trade Center',
    banner: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1000',
    isExternal: true,
    attendees: [],
  },
  {
    id: 'e10',
    title: 'Local Art & Innovation Gala',
    description: 'Exhibition blending art, design, and technology. Live demos and creative showcases.',
    date: 'Oct 20, 2024',
    time: '10:00 AM',
    location: 'Downtown Center',
    banner: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=1000',
    isExternal: true,
    attendees: [],
  },
];


interface PulseProps {
  user: User;
  setUser: (u: User) => void;
}

const Pulse: React.FC<PulseProps> = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState<'Our Campus' | 'External'>('Our Campus');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [regStep, setRegStep] = useState<'details' | 'role' | 'form' | 'success'>('details');
  const [role, setRole] = useState<'Participant' | 'Organizer' | null>(null);
  
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    teamName: '',
    college: '',
    area: 'Logistics'
  });

  const filteredEvents = MOCK_EVENTS.filter(e => {
    const matchesTab = activeTab === 'Our Campus' ? !e.isExternal : e.isExternal;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const startRegistration = (e: CampusEvent) => {
    setSelectedEvent(e);
    setRegStep('details');
  };

  const handleRegisterConfirm = () => {
    setRegStep('success');
    setTimeout(() => {
      const updatedUser = {
        ...user,
        joinedEvents: [...user.joinedEvents, selectedEvent!.id]
      };
      setUser(updatedUser);
      setTimeout(() => {
        setSelectedEvent(null);
        setRegStep('details');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="pb-32 pt-8 md:pt-12 px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">Pulse</h1>
          <p className="text-sm md:text-base text-slate-400 font-bold mt-2">Discover campus life in high fidelity.</p>
        </div>
        <div className="relative group max-w-lg w-full">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search size={22} className="text-slate-300 group-focus-within:text-purple-600 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search events..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white md:bg-white/80 backdrop-blur border border-slate-100 rounded-[1.5rem] md:rounded-[2rem] pl-16 pr-6 py-4 md:py-5 text-base md:text-lg focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all shadow-xl shadow-slate-200/50"
          />
        </div>
      </div>

      <div className="bg-slate-100 md:bg-slate-200/50 p-1.5 md:p-2 rounded-2xl md:rounded-[2rem] flex gap-2 mb-8 md:mb-12 max-w-xs md:max-w-sm">
        {(['Our Campus', 'External'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 md:py-4 rounded-xl md:rounded-[1.5rem] text-xs md:text-sm font-black transition-all duration-300 ${
              activeTab === tab 
                ? 'bg-white text-slate-900 shadow-xl' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        <AnimatePresence mode="popLayout">
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => startRegistration(event)}
              className="bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl border border-slate-50 group cursor-pointer hover:shadow-purple-200/40 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="relative h-48 md:h-72">
                <img src={event.banner} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute top-4 left-4 md:top-8 md:left-8">
                  <span className="bg-white/95 backdrop-blur text-slate-900 text-[10px] md:text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                    {event.date}
                  </span>
                </div>
              </div>
              <div className="p-6 md:p-10">
                <h3 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight group-hover:text-purple-600 transition-colors mb-4">{event.title}</h3>
                <div className="flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-8 text-[10px] md:text-sm text-slate-400 font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-slate-50 rounded-lg md:rounded-xl">
                    <Calendar size={14} className="text-purple-500" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-slate-50 rounded-lg md:rounded-xl">
                    <MapPin size={14} className="text-purple-500" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <button
                  className={`w-full py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] font-black text-sm md:text-lg transition-all duration-300 ${
                    user.joinedEvents.includes(event.id)
                      ? 'bg-green-50 text-green-500 border-2 border-green-100'
                      : 'bg-slate-900 text-white shadow-xl hover:bg-purple-700'
                  }`}
                >
                  {user.joinedEvents.includes(event.id) ? 'REGISTERED ✓' : 'SECURE YOUR SPOT'}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedEvent(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} className="relative w-full max-w-2xl bg-white rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl">
              <button onClick={() => setSelectedEvent(null)} className="absolute top-6 right-6 z-20 p-3 bg-slate-100 rounded-full hover:rotate-90 transition-all"><X size={20} /></button>

              {regStep === 'success' ? (
                <div className="p-12 md:p-20 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 md:w-32 md:h-32 bg-green-500 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-200">
                    <CheckCircle size={48} className="text-white" />
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">You're In!</h2>
                  <p className="text-slate-400 font-bold text-base md:text-lg">Check your profile for details.</p>
                </div>
              ) : (
                <div className="max-h-[85vh] overflow-y-auto scrollbar-hide">
                  <div className="h-40 md:h-64 relative">
                    <img src={selectedEvent.banner} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  </div>
                  <div className="p-8 md:p-12 -mt-10 relative bg-white rounded-t-[2.5rem] md:rounded-t-[4rem]">
                    {regStep === 'details' && (
                      <div className="space-y-6 md:space-y-8">
                        <h2 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">{selectedEvent.title}</h2>
                        <p className="text-base md:text-lg text-slate-500 leading-relaxed font-medium">{selectedEvent.description}</p>
                        <button onClick={() => setRegStep('role')} className="w-full py-5 md:py-6 bg-slate-900 text-white rounded-[1.5rem] md:rounded-[2.5rem] font-black text-lg md:text-xl shadow-2xl">CONTINUE</button>
                      </div>
                    )}

                    {regStep === 'role' && (
                      <div className="space-y-6 md:space-y-10">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900">Select Role</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                           <button onClick={() => { setRole('Participant'); setRegStep('form'); }} className="p-6 md:p-10 border-2 border-slate-50 rounded-[2rem] md:rounded-[3rem] hover:border-purple-500 hover:bg-purple-50 transition-all flex md:flex-col items-center gap-4 text-left md:text-center group">
                             <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors flex-shrink-0"><UserIcon size={24}/></div>
                             <span className="block font-black text-base md:text-lg">PARTICIPANT</span>
                           </button>
                           <button onClick={() => { setRole('Organizer'); setRegStep('form'); }} className="p-6 md:p-10 border-2 border-slate-50 rounded-[2rem] md:rounded-[3rem] hover:border-indigo-500 hover:bg-indigo-50 transition-all flex md:flex-col items-center gap-4 text-left md:text-center group">
                             <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors flex-shrink-0"><ShieldCheck size={24}/></div>
                             <span className="block font-black text-base md:text-lg">ORGANIZER</span>
                           </button>
                        </div>
                      </div>
                    )}

                    {regStep === 'form' && (
                      <div className="space-y-6 md:space-y-8 pb-8">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900">Details</h2>
                        <div className="space-y-4 md:space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                             <Input label="FULL NAME" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
                             <Input label="EMAIL" value={formData.email} onChange={v => setFormData({...formData, email: v})} />
                           </div>
                           {role === 'Participant' ? (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                               <Input label="TEAM (Optional)" value={formData.teamName} onChange={v => setFormData({...formData, teamName: v})} />
                               <Input label="COLLEGE" value={formData.college} onChange={v => setFormData({...formData, college: v})} />
                             </div>
                           ) : (
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">AREA</label>
                                <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.2rem] px-5 py-3 md:px-6 md:py-4 font-bold outline-none focus:border-purple-500">
                                  <option>Photography</option>
                                  <option>Mentor</option>
                                  <option>catering</option>
                                  <option>Tech</option>
                                    <option>Well come</option>
                                   <option>Other</option>
                                </select>
                             </div>
                           )}
                        </div>
                        <button onClick={handleRegisterConfirm} className="w-full py-5 md:py-6 bg-purple-600 text-white rounded-[1.5rem] md:rounded-[2.5rem] font-black text-lg shadow-2xl">REGISTER</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Input = ({ label, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase px-2">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={e => onChange(e.target.value)}
      className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.2rem] px-5 py-3 md:px-6 md:py-4 font-bold outline-none focus:border-purple-500"
    />
  </div>
);

export default Pulse;
