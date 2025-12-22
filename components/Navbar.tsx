
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, MessageCircle, Map as MapIcon, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { id: 'pulse', path: '/pulse', icon: LayoutGrid, label: 'Pulse' },
    { id: 'mentor', path: '/mentor', icon: MessageCircle, label: 'Mentor' },
    { id: 'connect', path: '/connect', icon: MapIcon, label: 'Connect' },
    { id: 'profile', path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs px-4">
      <nav className="bg-slate-900/95 backdrop-blur-md rounded-full px-4 py-2 flex items-center justify-around gap-1 shadow-2xl border border-white/10">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`p-3 rounded-full transition-all duration-300 flex items-center gap-2 ${
                isActive 
                  ? 'bg-white text-slate-900 shadow-lg' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && <span className="font-bold text-xs pr-1">{tab.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Navbar;
