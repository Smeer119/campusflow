
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, MessageSquare, Briefcase, GraduationCap, Zap, Sparkles, Send, CheckCircle2, Trophy, Search, Plus } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ConnectProfile, User } from '../types';

// Custom marker styles for the map
const customMarkerStyle = `
  .custom-marker {
    background: none !important;
    border: none !important;
  }
  
  .custom-marker img {
    transition: transform 0.2s ease-in-out;
  }
  
  .custom-marker:hover img {
    transform: scale(1.1);
  }
`;

// Add custom styles to the document head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = customMarkerStyle;
  document.head.appendChild(style);
}

// College locations in Karnataka, India
const COLLEGE_LOCATIONS = [
  { name: 'KLE BCA Gokak', lat: 16.1667, lng: 74.8333 },
  { name: 'VTU Belagavi', lat: 15.4589, lng: 74.9425 },
  { name: 'IISc Bangalore', lat: 13.0219, lng: 77.5674 },
  { name: 'NITK Surathkal', lat: 13.0138, lng: 74.7937 },
  { name: 'Manipal Institute of Technology', lat: 13.3515, lng: 74.7930 },
  { name: 'NIE Mysore', lat: 12.2958, lng: 76.6394 }
];

type ConnectMapProfile = ConnectProfile & {
  college: string;
  position: [number, number];
  color?: string;
  locationLabel?: string;
  skills?: string[];
  branch?: string;
  company?: string;
  role?: string;
};

type LocationSuggestion = {
  display_name: string;
  lat: string;
  lon: string;
};

const STORAGE_KEY = 'campusflow_connect_profiles_v1';

const randomId = () => {
  try {
    // @ts-ignore
    return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `p_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  } catch {
    return `p_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
};

const safeParseProfiles = (raw: string | null): ConnectMapProfile[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((p: any) => {
        if (!p || typeof p !== 'object') return null;
        if (!p.id || !p.name || !p.type || !p.position || !Array.isArray(p.position)) return null;
        if (p.position.length !== 2) return null;
        return p as ConnectMapProfile;
      })
      .filter(Boolean) as ConnectMapProfile[];
  } catch {
    return [];
  }
};

const MOCK_PROFILES: (ConnectProfile & { college: string; position: [number, number] })[] = [
  {
    id: 'p1',
    name: 'Troy Blaze',
    type: 'Alumni',
    stream: 'Comp Sci',
    year: 'Class of 2021',
    currentRole: 'UX Lead @ Google',
    interests: ['Product Design', 'Basketball', 'Hiking'],
    location: { x: 0, y: 0 }, // Not used in map view
    position: [COLLEGE_LOCATIONS[0].lat + 0.0031, COLLEGE_LOCATIONS[0].lng - 0.0022],
    college: 'KLE BCA Gokak',
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
    location: { x: 0, y: 0 }, // Not used in map view
    position: [COLLEGE_LOCATIONS[1].lat - 0.0026, COLLEGE_LOCATIONS[1].lng + 0.0019],
    college: 'VTU Belagavi',
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
    location: { x: 0, y: 0 }, // Not used in map view
    position: [COLLEGE_LOCATIONS[2].lat + 0.0014, COLLEGE_LOCATIONS[2].lng + 0.0035],
    college: 'IISc Bangalore',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    bg: 'bg-rose-500'
  },
  {
    id: 'p4',
    name: 'Aarav Sharma',
    type: 'Student',
    stream: 'Computer Science',
    year: 'Junior',
    interests: ['AI/ML', 'Robotics', 'Coding'],
    location: { x: 0, y: 0 },
    position: [COLLEGE_LOCATIONS[3].lat - 0.0033, COLLEGE_LOCATIONS[3].lng - 0.0017],
    college: 'NITK Surathkal',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    bg: 'bg-emerald-500'
  },
  {
    id: 'p5',
    name: 'Priya Patel',
    type: 'Student',
    stream: 'Biotechnology',
    year: 'Senior',
    interests: ['Research', 'Genetics', 'Medicine'],
    location: { x: 0, y: 0 },
    position: [COLLEGE_LOCATIONS[4].lat + 0.0022, COLLEGE_LOCATIONS[4].lng - 0.0031],
    college: 'Manipal Institute of Technology',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    bg: 'bg-amber-500'
  },
  {
    id: 'p6',
    name: 'Rahul Verma',
    type: 'Alumni',
    stream: 'Mechanical Engineering',
    year: 'Class of 2020',
    currentRole: 'Automotive Engineer @ Tata Motors',
    interests: ['Cars', 'Robotics', '3D Printing'],
    location: { x: 0, y: 0 },
    position: [COLLEGE_LOCATIONS[5].lat - 0.0018, COLLEGE_LOCATIONS[5].lng + 0.0028],
    college: 'NIE Mysore',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    bg: 'bg-indigo-500'
  },
  {
    id: 'p7',
    name: 'Neha Kulkarni',
    type: 'Student',
    stream: 'Information Science',
    year: '2nd Year',
    interests: ['DSA', 'Hackathons', 'UI Design'],
    location: { x: 0, y: 0 },
    position: [COLLEGE_LOCATIONS[2].lat - 0.0041, COLLEGE_LOCATIONS[2].lng + 0.0012],
    college: 'IISc Bangalore',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200',
    bg: 'bg-fuchsia-500'
  },
  {
    id: 'p8',
    name: 'Kiran Shetty',
    type: 'Alumni',
    stream: 'Computer Science',
    year: 'Class of 2018',
    currentRole: 'SDE @ Microsoft',
    interests: ['System Design', 'Open Source', 'Mentoring'],
    location: { x: 0, y: 0 },
    position: [COLLEGE_LOCATIONS[1].lat + 0.0037, COLLEGE_LOCATIONS[1].lng - 0.0029],
    college: 'VTU Belagavi',
    avatar: 'https://images.unsplash.com/photo-1520975958225-52f27337d0c0?auto=format&fit=crop&q=80&w=200',
    bg: 'bg-slate-900'
  },
  {
    id: 'p9',
    name: 'Aisha Khan',
    type: 'Student',
    stream: 'Electronics',
    year: 'Final Year',
    interests: ['IoT', 'Embedded', 'Robotics'],
    location: { x: 0, y: 0 },
    position: [COLLEGE_LOCATIONS[3].lat + 0.0029, COLLEGE_LOCATIONS[3].lng + 0.0031],
    college: 'NITK Surathkal',
    avatar: 'https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&q=80&w=200',
    bg: 'bg-cyan-500'
  },
  {
    id: 'p10',
    name: 'Rohit Desai',
    type: 'Alumni',
    stream: 'Mechanical Engineering',
    year: 'Class of 2017',
    currentRole: 'Product Engineer @ Bosch',
    interests: ['CAD', 'Automation', 'EV Tech'],
    location: { x: 0, y: 0 },
    position: [COLLEGE_LOCATIONS[5].lat + 0.0043, COLLEGE_LOCATIONS[5].lng - 0.0011],
    college: 'NIE Mysore',
    avatar: 'https://images.unsplash.com/photo-1508341591423-4347099e1f19?auto=format&fit=crop&q=80&w=200',
    bg: 'bg-orange-500'
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
  const [mapReady, setMapReady] = useState(false);
  const [profiles, setProfiles] = useState<ConnectMapProfile[]>(() => {
    const stored = safeParseProfiles(typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null);
    return [...MOCK_PROFILES, ...stored];
  });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addStep, setAddStep] = useState<1 | 2>(1);
  const [addType, setAddType] = useState<'Student' | 'Alumni' | ''>('');
  const [addName, setAddName] = useState('');
  const [addCollege, setAddCollege] = useState('');
  const [addYear, setAddYear] = useState('');
  const [addStream, setAddStream] = useState('');
  const [addBranch, setAddBranch] = useState('');
  const [addSkillInput, setAddSkillInput] = useState('');
  const [addSkills, setAddSkills] = useState<string[]>([]);
  const [addCompany, setAddCompany] = useState('');
  const [addRole, setAddRole] = useState('');
  const [addInterestInput, setAddInterestInput] = useState('');
  const [addInterests, setAddInterests] = useState<string[]>([]);
  const [addColor, setAddColor] = useState('#7c3aed');
  const [locationQuery, setLocationQuery] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLocLoading, setIsLocLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ label: string; position: [number, number] } | null>(null);
  const locationFetchSeq = useRef(0);

  // Initialize map when component mounts
  useEffect(() => {
    setMapReady(true);
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([15.3173, 75.7139]); // Center of Karnataka
  const mapRef = useRef<L.Map | null>(null);

  // Filter profiles based on search query
  const filteredProfiles = profiles.filter(profile => 
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.interests.some(interest => 
      interest.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = safeParseProfiles(localStorage.getItem(STORAGE_KEY));
    setProfiles([...MOCK_PROFILES, ...stored]);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedOnly = profiles.filter(p => !MOCK_PROFILES.some(mp => mp.id === p.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedOnly));
  }, [profiles]);

  useEffect(() => {
    if (!isAddOpen) return;
    const q = locationQuery.trim();
    if (q.length < 3) {
      setLocationSuggestions([]);
      return;
    }
    const seq = ++locationFetchSeq.current;
    setIsLocLoading(true);
    const handle = window.setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=6&q=${encodeURIComponent(q)}`;
        const res = await fetch(url, {
          headers: {
            'Accept': 'application/json'
          }
        });
        const data = (await res.json()) as LocationSuggestion[];
        if (locationFetchSeq.current !== seq) return;
        setLocationSuggestions(Array.isArray(data) ? data : []);
      } catch {
        if (locationFetchSeq.current !== seq) return;
        setLocationSuggestions([]);
      } finally {
        if (locationFetchSeq.current === seq) setIsLocLoading(false);
      }
    }, 250);
    return () => window.clearTimeout(handle);
  }, [locationQuery, isAddOpen]);

  const resetAddForm = () => {
    setAddStep(1);
    setAddType('');
    setAddName('');
    setAddCollege('');
    setAddYear('');
    setAddStream('');
    setAddBranch('');
    setAddSkillInput('');
    setAddSkills([]);
    setAddCompany('');
    setAddRole('');
    setAddInterestInput('');
    setAddInterests([]);
    setAddColor('#7c3aed');
    setLocationQuery('');
    setLocationSuggestions([]);
    setIsLocLoading(false);
    setSelectedLocation(null);
  };

  const selectAddType = (t: 'Student' | 'Alumni') => {
    setAddType(t);
    setAddStep(2);
  };

  const addInterest = () => {
    const v = addInterestInput.trim();
    if (!v) return;
    if (addInterests.some(i => i.toLowerCase() === v.toLowerCase())) {
      setAddInterestInput('');
      return;
    }
    setAddInterests(prev => [...prev, v]);
    setAddInterestInput('');
  };

  const removeInterest = (val: string) => {
    setAddInterests(prev => prev.filter(i => i !== val));
  };

  const addSkill = () => {
    const v = addSkillInput.trim();
    if (!v) return;
    if (addSkills.some(s => s.toLowerCase() === v.toLowerCase())) {
      setAddSkillInput('');
      return;
    }
    setAddSkills(prev => [...prev, v]);
    setAddSkillInput('');
  };

  const removeSkill = (val: string) => {
    setAddSkills(prev => prev.filter(s => s !== val));
  };

  const saveNewProfile = () => {
    if (!addType) return;
    const name = addName.trim();
    const college = addCollege.trim();
    if (!name || !college) return;
    if (!selectedLocation) return;

    const newProfile: ConnectMapProfile = {
      id: randomId(),
      name,
      type: addType,
      stream: addStream.trim() || (addType === 'Student' ? 'Student' : 'Alumni'),
      year: addYear.trim() || (addType === 'Student' ? 'Student' : 'Alumni'),
      currentRole: addType === 'Alumni' ? (addRole.trim() ? `${addRole.trim()}${addCompany.trim() ? ` @ ${addCompany.trim()}` : ''}` : (addCompany.trim() ? `@ ${addCompany.trim()}` : undefined)) : undefined,
      interests: addType === 'Student' ? (addInterests.length ? addInterests : ['Networking']) : (addInterests.length ? addInterests : ['Mentorship']),
      location: { x: 0, y: 0 },
      position: selectedLocation.position,
      college,
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      bg: 'bg-slate-900',
      color: addColor,
      locationLabel: selectedLocation.label,
      skills: addSkills.length ? addSkills : undefined,
      branch: addBranch.trim() || undefined,
      company: addCompany.trim() || undefined,
      role: addRole.trim() || undefined
    };

    setProfiles(prev => [...prev, newProfile]);
    setIsAddOpen(false);
    resetAddForm();
    setMapCenter(newProfile.position);
    if (mapRef.current) {
      mapRef.current.flyTo(newProfile.position, 14, { duration: 1.2, animate: true });
    }
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredProfiles.length > 0) {
      const firstMatch = filteredProfiles[0];
      if ('position' in firstMatch) {
        setMapCenter(firstMatch.position);
        if (mapRef.current) {
          mapRef.current.flyTo(firstMatch.position, 13, {
            duration: 1.5,
            animate: true
          });
        }
      }
    }
  };

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
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">Connect</h1>
            <p className="text-sm md:text-base text-slate-400 font-bold mt-2">Find students and alumni across campuses in Karnataka.</p>
          </div>
          <button
            onClick={() => { setIsAddOpen(true); resetAddForm(); }}
            className="shrink-0 inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest shadow-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={18} /> ADD
          </button>
        </div>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-6 relative max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, college, or interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-purple-700 transition-colors"
            >
              Search
            </button>
          </div>
          {searchQuery && (
            <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-lg border border-slate-200 max-h-60 overflow-y-auto">
              {filteredProfiles.length > 0 ? (
                filteredProfiles.map(profile => (
                  <div 
                    key={profile.id}
                    onClick={() => {
                      setSelected(profile);
                      if ('position' in profile) {
                        setMapCenter(profile.position);
                        if (mapRef.current) {
                          mapRef.current.flyTo(profile.position, 15, {
                            duration: 1,
                            animate: true
                          });
                        }
                      }
                    }}
                    className="p-4 hover:bg-slate-50 cursor-pointer flex items-center gap-3"
                  >
                    <img 
                      src={profile.avatar} 
                      alt={profile.name} 
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-medium text-slate-800">{profile.name}</div>
                      <div className="text-xs text-slate-500">{profile.college}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-slate-500 text-center">No results found</div>
              )}
            </div>
          )}
        </form>
      </div>

      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAddOpen(false); }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900">Add Profile</h2>
                  <p className="text-slate-400 font-bold text-xs md:text-sm mt-1">This will be saved in your browser (localStorage).</p>
                </div>
                <button onClick={() => setIsAddOpen(false)} className="p-3 bg-slate-100 rounded-full hover:rotate-90 transition-all"><X size={18} /></button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto scrollbar-hide flex-1">
                {addStep === 1 ? (
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Step 1</label>
                      <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">Are you a Student or Alumni?</h3>
                      <p className="text-slate-400 font-bold text-sm mt-2">Choose one to continue.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => selectAddType('Student')}
                        className="px-6 py-6 rounded-[2rem] border border-slate-200 hover:border-slate-300 bg-white text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center">
                            <GraduationCap size={20} />
                          </div>
                          <div>
                            <div className="font-black text-slate-900 text-lg">Student</div>
                            <div className="text-slate-400 font-bold text-xs mt-1">Add interests + skills (optional)</div>
                          </div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => selectAddType('Alumni')}
                        className="px-6 py-6 rounded-[2rem] border border-slate-200 hover:border-slate-300 bg-white text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                            <Briefcase size={20} />
                          </div>
                          <div>
                            <div className="font-black text-slate-900 text-lg">Alumni</div>
                            <div className="text-slate-400 font-bold text-xs mt-1">Add company + role</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 flex items-center justify-between gap-3">
                      <div className="text-xs font-black uppercase tracking-widest text-slate-500">Step 2</div>
                      <button
                        type="button"
                        onClick={() => { setAddStep(1); setAddType(''); }}
                        className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-700"
                      >
                        Change Type
                      </button>
                    </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Name</label>
                    <input value={addName} onChange={e => setAddName(e.target.value)} className="mt-2 w-full px-4 py-4 rounded-2xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Full name" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">College</label>
                    <input value={addCollege} onChange={e => setAddCollege(e.target.value)} className="mt-2 w-full px-4 py-4 rounded-2xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., KLE BCA Gokak" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Location</label>
                    <div className="mt-2 relative">
                      <input
                        value={locationQuery}
                        onChange={(e) => { setLocationQuery(e.target.value); setSelectedLocation(null); }}
                        className="w-full px-4 py-4 rounded-2xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Start typing a place (city/college)"
                      />
                      {isLocLoading && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
                      )}
                      {(locationQuery.trim().length >= 3 && locationSuggestions.length > 0 && !selectedLocation) && (
                        <div className="absolute z-20 mt-2 w-full bg-white rounded-2xl shadow-lg border border-slate-200 max-h-64 overflow-y-auto">
                          {locationSuggestions.map((s) => (
                            <button
                              key={`${s.lat}_${s.lon}_${s.display_name}`}
                              onClick={() => {
                                const pos: [number, number] = [parseFloat(s.lat), parseFloat(s.lon)];
                                setSelectedLocation({ label: s.display_name, position: pos });
                                setLocationQuery(s.display_name);
                                setLocationSuggestions([]);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-slate-50"
                            >
                              <div className="text-sm font-bold text-slate-800 line-clamp-2">{s.display_name}</div>
                            </button>
                          ))}
                        </div>
                      )}
                      {selectedLocation && (
                        <div className="mt-2 text-xs font-bold text-green-600">Selected: {selectedLocation.label}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Year</label>
                    <input value={addYear} onChange={e => setAddYear(e.target.value)} className="mt-2 w-full px-4 py-4 rounded-2xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., 2nd Year / Class of 2022" />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Stream</label>
                    <input value={addStream} onChange={e => setAddStream(e.target.value)} className="mt-2 w-full px-4 py-4 rounded-2xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., BCA / CSE" />
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Branch (optional)</label>
                    <input value={addBranch} onChange={e => setAddBranch(e.target.value)} className="mt-2 w-full px-4 py-4 rounded-2xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., AI" />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Skills (optional)</label>
                    <div className="mt-2 flex gap-2">
                      <input
                        value={addSkillInput}
                        onChange={e => setAddSkillInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                        className="flex-1 px-4 py-4 rounded-2xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Type a skill and press Enter"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="px-4 py-4 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest"
                      >
                        Add
                      </button>
                    </div>
                    {addSkills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {addSkills.map(s => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => removeSkill(s)}
                            className="px-3 py-2 rounded-full bg-slate-100 text-slate-700 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200"
                          >
                            {s} ×
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {addType === 'Alumni' && (
                    <>
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Company</label>
                        <input value={addCompany} onChange={e => setAddCompany(e.target.value)} className="mt-2 w-full px-4 py-4 rounded-2xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., Infosys" />
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Role</label>
                        <input value={addRole} onChange={e => setAddRole(e.target.value)} className="mt-2 w-full px-4 py-4 rounded-2xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., Software Engineer" />
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Interests</label>
                    <div className="mt-2 flex gap-2">
                      <input
                        value={addInterestInput}
                        onChange={e => setAddInterestInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addInterest(); } }}
                        className="flex-1 px-4 py-4 rounded-2xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Type and press Enter"
                      />
                      <button
                        onClick={addInterest}
                        className="px-4 py-4 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest"
                      >
                        Add
                      </button>
                    </div>
                    {addInterests.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {addInterests.map(i => (
                          <button
                            key={i}
                            onClick={() => removeInterest(i)}
                            className="px-3 py-2 rounded-full bg-slate-100 text-slate-700 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200"
                          >
                            {i} ×
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Card Color</label>
                    <div className="mt-2 flex items-center gap-3">
                      <input type="color" value={addColor} onChange={e => setAddColor(e.target.value)} className="h-12 w-16 rounded-xl border border-slate-200" />
                      <div className="flex-1 px-4 py-4 rounded-2xl border border-slate-200 font-bold text-slate-700">{addColor}</div>
                    </div>
                  </div>
                </div>
                )}
              </div>

              <div className="p-6 md:p-8 border-t border-slate-100 flex items-center justify-end gap-3 bg-white">
                <button onClick={() => { setIsAddOpen(false); }} className="px-5 py-4 rounded-2xl bg-slate-100 text-slate-700 font-black text-xs uppercase tracking-widest">Cancel</button>
                <button
                  onClick={saveNewProfile}
                  disabled={addStep !== 2 || !addType || !addName.trim() || !addCollege.trim() || !selectedLocation}
                  className="px-6 py-4 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Map Background */}
      <div className="flex-1 relative" style={{ minHeight: '60vh' }}>
        {mapReady && (
        <div className="absolute inset-0 z-0" style={{ height: '100%', width: '100%' }}>
          <MapContainer 
            center={mapCenter}
            zoom={8}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
            attributionControl={false}
            className="rounded-[2.5rem] md:rounded-[5rem] overflow-hidden z-0"
            whenCreated={(map) => {
              mapRef.current = map;
              // Add college location markers
              COLLEGE_LOCATIONS.forEach(college => {
                L.marker([college.lat, college.lng])
                  .addTo(map)
                  .bindPopup(`<div class="text-center"><strong>${college.name}</strong></div>`);
              });
            }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              className="map-tiles"
            />
            {filteredProfiles.map((profile) => {
              // Create a custom icon for each profile
              const bgStyle = profile.color ? `background-color:${profile.color};` : '';
              const customIcon = L.divIcon({
                html: `
                  <div class="relative">
                    <div class="w-14 h-14 md:w-16 md:h-16 rounded-2xl border-2 md:border-4 border-white shadow-xl overflow-hidden ${profile.bg}" style="${bgStyle}">
                      <img src="${profile.avatar}" class="w-full h-full object-cover" alt="${profile.name}" />
                    </div>
                    ${connectedIds.has(profile.id) ? `
                      <div class="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    ` : ''}
                  </div>
                `,
                className: 'custom-marker',
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
              });

              return (
                <Marker 
                  key={profile.id} 
                  position={'position' in profile ? profile.position : [0, 0]}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => setSelected(profile),
                  }}
                />
              );
            })}
          </MapContainer>
        </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent pointer-events-none rounded-[2.5rem] md:rounded-[5rem]" />
        
        {/* College Legend */}
       
      </div>

      {/* Profile Detail Card Overlay */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xl" />
            <motion.div
              initial={{ scale: 0.8, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 100 }}
              style={{ backgroundColor: (selected as any)?.color || undefined }}
              className={`relative w-full max-w-sm rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl h-[85vh] md:h-[700px] flex flex-col ${selected.bg}`}
            >
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

                  <div className="w-full space-y-4 mb-12">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center justify-center gap-2 bg-black/20 px-5 py-3 rounded-2xl border border-white/10">
                        <GraduationCap size={16} />
                        <span className="font-bold text-xs md:text-sm uppercase tracking-widest">{selected.type}</span>
                      </div>

                      {(selected as any)?.college && (
                        <div className="flex items-center justify-center gap-2 bg-black/20 px-5 py-3 rounded-2xl border border-white/10">
                          <span className="font-black text-[10px] md:text-xs uppercase tracking-widest opacity-80">College</span>
                          <span className="font-bold text-xs md:text-sm">{(selected as any).college}</span>
                        </div>
                      )}

                      {(selected as any)?.locationLabel && (
                        <div className="flex items-center justify-center gap-2 bg-black/20 px-5 py-3 rounded-2xl border border-white/10">
                          <MapPin size={16} />
                          <span className="font-bold text-xs md:text-sm line-clamp-2">{(selected as any).locationLabel}</span>
                        </div>
                      )}

                      {(selected as any)?.branch && (
                        <div className="flex items-center justify-center gap-2 bg-black/20 px-5 py-3 rounded-2xl border border-white/10">
                          <span className="font-black text-[10px] md:text-xs uppercase tracking-widest opacity-80">Branch</span>
                          <span className="font-bold text-xs md:text-sm">{(selected as any).branch}</span>
                        </div>
                      )}

                      {(selected as any)?.company || (selected as any)?.role || selected.currentRole ? (
                        <div className="flex items-center justify-center gap-3 bg-black/20 px-5 py-3 rounded-2xl border border-white/10">
                          <Briefcase size={16} />
                          <span className="font-bold text-xs md:text-sm">{selected.currentRole || `${(selected as any).role || ''}${(selected as any).company ? ` @ ${(selected as any).company}` : ''}`}</span>
                        </div>
                      ) : null}
                    </div>

                    {Array.isArray(selected.interests) && selected.interests.length > 0 && (
                      <div>
                        <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-2">Interests</div>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {selected.interests.map(i => (
                            <span key={i} className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest">{i}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {Array.isArray((selected as any)?.skills) && (selected as any).skills.length > 0 && (
                      <div>
                        <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-2">Skills</div>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {(selected as any).skills.map((s: string) => (
                            <span key={s} className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest">{s}</span>
                          ))}
                        </div>
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
