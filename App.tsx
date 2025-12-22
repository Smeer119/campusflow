
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Pulse from './pages/Pulse';
import Mentor from './pages/Mentor';
import Connect from './pages/Connect';
import Profile from './pages/Profile';
import { User as UserType } from './types';
import { LayoutGrid, MessageCircle, Map as MapIcon, User as UserIcon } from 'lucide-react';

const BackgroundAnimation: React.FC = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-white md:bg-[#FAFAFA]">
    {/* Only show animated blobs on desktop to maintain clean mobile UI */}
    <div className="hidden md:block">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-[120px] animate-blob" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
    </div>
  </div>
);

const DesktopSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tabs = [
    { id: 'pulse', path: '/pulse', icon: LayoutGrid, label: 'Pulse' },
    { id: 'mentor', path: '/mentor', icon: MessageCircle, label: 'Mentor' },
    { id: 'connect', path: '/connect', icon: MapIcon, label: 'Connect' },
    { id: 'profile', path: '/profile', icon: UserIcon, label: 'Profile' },
  ];

  return (
    <div className="hidden md:flex flex-col w-80 bg-white/70 backdrop-blur-xl border-r border-slate-100 p-8 sticky top-0 h-screen">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 bg-gradient-to-br from-[#A78BFA] to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-200 text-white">
          <LayoutGrid size={28} />
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">CampusFlow</h1>
      </div>
      <nav className="space-y-3">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`w-full flex items-center gap-5 px-6 py-4 rounded-3xl transition-all duration-300 font-bold ${
                isActive 
                  ? 'bg-slate-900 text-white shadow-2xl shadow-slate-300 scale-[1.02]' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
              }`}
            >
              <Icon size={24} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="mt-auto space-y-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-[2.5rem] text-white shadow-xl">
          <p className="text-xs font-black uppercase tracking-widest mb-3 opacity-80">Discovery</p>
          <p className="text-sm font-bold leading-relaxed">Check the Connect map to see which alumni are currently nearby!</p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem('cf_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = () => {
    const mockUser: UserType = {
      id: 'u123',
      name: 'Kate Malone',
      email: 'kate.malone@campus.edu',
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      collegeId: 'tech_univ_01',
      joinedEvents: [],
      echoCount: 3,
    };
    setUser(mockUser);
    localStorage.setItem('cf_user', JSON.stringify(mockUser));
  };

  const handleUpdateUser = (updated: UserType) => {
    setUser(updated);
    localStorage.setItem('cf_user', JSON.stringify(updated));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cf_user');
  };

  return (
    <HashRouter>
      <div className="min-h-screen w-full relative bg-white overflow-x-hidden">
        <BackgroundAnimation />
        <div className="md:flex h-full">
          {user && <DesktopSidebar />}
          <main className="flex-1 w-full max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={user ? <Navigate to="/pulse" /> : <Landing onLogin={handleLogin} />} />
              <Route path="/pulse" element={user ? <Pulse user={user} setUser={handleUpdateUser} /> : <Navigate to="/" />} />
              <Route path="/mentor" element={user ? <Mentor /> : <Navigate to="/" />} />
              <Route path="/connect" element={user ? <Connect user={user} /> : <Navigate to="/" />} />
              <Route path="/profile" element={user ? <Profile user={user} setUser={handleUpdateUser} onLogout={handleLogout} /> : <Navigate to="/" />} />
            </Routes>
          </main>
          {user && <div className="md:hidden"><Navbar /></div>}
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
