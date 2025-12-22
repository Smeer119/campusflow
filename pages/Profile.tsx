
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, LogOut, Award, Calendar, Megaphone, ChevronRight, ArrowLeft, Trash2, MapPin, Edit3, Camera, Check, AlertTriangle, Plus, X, ClipboardList } from 'lucide-react';
import { User, EchoPost } from '../types';

interface ProfileProps {
  user: User;
  setUser: (u: User) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, setUser, onLogout }) => {
  const [activeView, setActiveView] = useState<'main' | 'events' | 'report'>('main');
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [reportForm, setReportForm] = useState({ title: '', desc: '', img: '' });

  const handleUpdateName = () => {
    setUser({ ...user, name: editName });
    setShowEdit(false);
  };

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Report submitted to Campus Authorities!");
    setActiveView('main');
    setReportForm({ title: '', desc: '', img: '' });
  };

  return (
    <div className="pb-40 min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {activeView === 'main' && (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col">
            {/* Improved Header for Mobile */}
            <div className="relative h-64 md:h-96 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-400 overflow-hidden md:rounded-b-[6rem]">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
               <div className="absolute top-8 left-6 right-6 flex justify-between z-20">
                <button onClick={() => setShowEdit(true)} className="p-3 bg-white/20 backdrop-blur-xl rounded-2xl text-white border border-white/20 shadow-lg"><Edit3 size={20} /></button>
                <button onClick={onLogout} className="p-3 bg-white/20 backdrop-blur-xl rounded-2xl text-white border border-white/20 shadow-lg"><LogOut size={20} /></button>
              </div>
              
              {/* Profile Bio Card */}
              <div className="absolute -bottom-16 left-4 right-4 md:left-24 md:right-24 bg-white rounded-[2.5rem] md:rounded-[5rem] p-6 md:p-12 shadow-2xl border border-slate-100 flex flex-col items-center text-center z-10">
                <div className="absolute -top-12 md:-top-20 w-24 h-24 md:w-40 md:h-40 rounded-3xl md:rounded-[4rem] border-4 md:border-8 border-white shadow-xl overflow-hidden bg-slate-100">
                  <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className="mt-14 md:mt-24 space-y-2 md:space-y-4">
                  <h2 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">{user.name}</h2>
                  <p className="text-[10px] md:text-xs font-black text-purple-600 uppercase tracking-[0.2em] md:tracking-[0.4em]">VERIFIED CAMPUS ID: CF-00123</p>
                  <div className="flex gap-2 md:gap-4 justify-center pt-2 md:pt-4">
                    <span className="px-4 md:px-8 py-2 md:py-3 bg-slate-900 text-white rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest">ACTIVE</span>
                    <button onClick={() => setActiveView('report')} className="px-4 md:px-8 py-2 md:py-3 bg-red-50 text-red-600 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest border border-red-100 flex items-center gap-1 md:gap-2">
                       <AlertTriangle size={12} /> REPORT
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats & Dashboard Content */}
            <div className="mt-24 md:mt-32 px-6 md:px-10 space-y-8 md:space-y-16">
              <div className="grid grid-cols-2 gap-4 md:gap-8">
                <StatBox icon={<Award className="text-orange-500" />} label="Events" value={user.joinedEvents.length} color="orange" />
                <StatBox icon={<Megaphone className="text-purple-500" />} label="Echoes" value={user.echoCount} color="purple" />
              </div>

              <div className="space-y-6">
                <h3 className="text-[10px] md:text-xs font-black text-slate-300 uppercase tracking-[0.3em] md:tracking-[0.4em] px-2">Manage Activity</h3>
                <ProfileLinkItem onClick={() => setActiveView('events')} icon={<Calendar className="text-blue-500" />} title="Registered Events" count={user.joinedEvents.length} />
                
                {/* Personal Bio */}
                <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 border border-slate-50 shadow-sm">
                   <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Personal Bio</h3>
                   <p className="text-lg md:text-xl font-bold text-slate-500 leading-relaxed italic">"CS Student | Open Source Contributor | Coffee Lover. Looking to connect with alumni in Silicon Valley."</p>
                </div>

                {/* New Reports History Section */}
                <div className="space-y-4">
                  <h3 className="text-[10px] md:text-xs font-black text-slate-300 uppercase tracking-[0.4em] px-2 pt-4">Your Recent Reports</h3>
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm">
                          <ClipboardList size={24} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-slate-800 text-sm">Campus Lighting Issue #{i}</h4>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Status: Under Review</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* List Views & Report Form */}
        {activeView === 'events' && (
          <motion.div key="list" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="px-6 md:px-10 pt-12 max-w-4xl mx-auto">
             <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-16">
                <button onClick={() => setActiveView('main')} className="p-3 md:p-5 bg-white rounded-2xl md:rounded-[1.5rem] shadow-xl border border-slate-50">
                  <ArrowLeft size={20} />
                </button>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900">Events</h2>
             </div>
             <div className="grid gap-4 md:gap-8 pb-32">
               {user.joinedEvents.length > 0 ? (
                 user.joinedEvents.map(ev => <EventListItem key={ev} id={ev} />)
               ) : <div className="py-20 md:py-40 text-center opacity-20"><Calendar size={80} className="mx-auto mb-6 md:mb-10" /><p className="text-lg md:text-2xl font-black uppercase">No events yet.</p></div>}
             </div>
          </motion.div>
        )}

        {activeView === 'report' && (
          <motion.div key="report" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="px-6 pt-12 max-w-3xl mx-auto pb-40">
             <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-16">
                <button onClick={() => setActiveView('main')} className="p-3 md:p-5 bg-white rounded-2xl shadow-xl border border-slate-50">
                  <ArrowLeft size={20} />
                </button>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900">Report</h2>
             </div>
             <form onSubmit={handleReport} className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 shadow-2xl border border-slate-100 space-y-6 md:space-y-10">
                <div className="space-y-2 md:space-y-4">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase px-4">Subject</label>
                  <input required placeholder="Brief title..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] md:rounded-[2rem] px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-bold outline-none focus:border-red-500 transition-colors" value={reportForm.title} onChange={e => setReportForm({...reportForm, title: e.target.value})} />
                </div>
                <div className="space-y-2 md:space-y-4">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase px-4">Details</label>
                  <textarea required rows={4} placeholder="What happened?" className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] md:rounded-[2rem] px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-bold outline-none focus:border-red-500 transition-colors resize-none" value={reportForm.desc} onChange={e => setReportForm({...reportForm, desc: e.target.value})} />
                </div>
                <div className="w-full aspect-video bg-slate-50 border-2 md:border-4 border-dashed border-slate-200 rounded-[2rem] md:rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors overflow-hidden">
                   <Camera size={32} className="text-slate-300 mb-2 md:mb-4" />
                   <p className="text-[10px] md:text-sm font-black text-slate-300 uppercase tracking-widest">Add Evidence</p>
                </div>
                <button type="submit" className="w-full py-5 md:py-7 bg-red-600 text-white rounded-[2rem] md:rounded-[3rem] font-black text-lg md:text-xl shadow-2xl shadow-red-200">SUBMIT REPORT</button>
             </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEdit && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEdit(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }} className="relative w-full max-w-lg bg-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 shadow-2xl">
              <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-6 md:mb-10">Settings</h2>
              <div className="space-y-6 md:space-y-10">
                <div className="space-y-2 md:space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-4">Name</label>
                   <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] md:rounded-[2rem] px-6 md:px-8 py-4 md:py-5 text-lg md:text-xl font-bold outline-none focus:border-purple-500 transition-colors" />
                </div>
                <button onClick={handleUpdateName} className="w-full py-5 md:py-7 bg-slate-900 text-white rounded-[2rem] md:rounded-[2.5rem] font-black text-lg md:text-xl shadow-2xl flex items-center justify-center gap-3">
                  <Check size={24} /> SAVE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatBox = ({ icon, label, value, color }: any) => (
  <div className="bg-white rounded-[2rem] md:rounded-[4rem] p-6 md:p-12 shadow-sm border border-slate-50 flex flex-col items-center text-center gap-4 md:gap-6 group hover:shadow-2xl transition-all duration-700">
    <div className={`p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] group-hover:scale-110 transition-transform ${color === 'orange' ? 'bg-orange-50' : 'bg-purple-50'}`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <span className="text-3xl md:text-6xl font-black text-slate-900 leading-none">{value}</span>
    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{label}</span>
  </div>
);

const ProfileLinkItem = ({ icon, title, count, onClick }: any) => (
  <div onClick={onClick} className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 flex items-center justify-between shadow-sm border border-slate-50 group cursor-pointer hover:shadow-xl transition-all">
    <div className="flex items-center gap-4 md:gap-8">
      <div className="bg-slate-50 p-4 md:p-6 rounded-2xl md:rounded-[1.5rem] group-hover:bg-purple-50 transition-colors">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div>
        <h4 className="font-black text-slate-800 text-lg md:text-2xl">{title}</h4>
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{count} ITEMS</span>
      </div>
    </div>
    <ChevronRight className="text-slate-200 group-hover:text-purple-400 transition-colors" />
  </div>
);

const EventListItem = ({ id }: any) => (
  <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 shadow-sm border border-slate-100">
    <div className="w-full md:w-28 h-40 md:h-28 rounded-2xl md:rounded-[2rem] overflow-hidden bg-slate-50 shadow-inner">
      <img src={`https://picsum.photos/seed/${id}/400`} className="w-full h-full object-cover" />
    </div>
    <div className="flex-1 text-center md:text-left">
      <h4 className="text-xl md:text-3xl font-black text-slate-900 mb-1">Campus Event #{id}</h4>
      <p className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Confirmed</p>
      <button className="text-[10px] font-black text-red-400 hover:underline uppercase tracking-widest">Withdraw</button>
    </div>
  </div>
);

export default Profile;
