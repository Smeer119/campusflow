
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Heart, AlertCircle, Plus, Share2, Bookmark, X, Camera, Send, MoreHorizontal } from 'lucide-react';
import { EchoPost, User, EchoComment } from '../types';

const MOCK_REPORTS: EchoPost[] = [
  {
    id: 'r1',
    title: 'Library AC Issue',
    content: "The second floor study zone is boiling hot. It's impossible to focus on finals with this heat. Can we get maintenance to look at it?",
    status: 'Investigating',
    likes: 245,
    comments: 2,
    flags: 0,
    createdAt: '2h ago',
    authorId: 'u000',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800',
    commentsList: [
      { id: 'c1', text: 'I was there today, it was unbearable!', user: 'Anon Student', time: '1h ago' },
      { id: 'c2', text: 'Hope they fix it soon, I have an exam tomorrow.', user: 'StudyBee', time: '30m ago' }
    ]
  },
  {
    id: 'r2',
    title: 'Cafeteria Vegan Options',
    content: "We need more than just a salad bar for vegan options. Please consider adding a dedicated plant-based station for lunches.",
    status: 'Resolved',
    likes: 890,
    comments: 1,
    flags: 1,
    createdAt: '5h ago',
    authorId: 'u111',
    commentsList: [
      { id: 'c3', text: 'Agreed! More variety please.', user: 'VeggieVibes', time: '2h ago' }
    ]
  },
  {
    id: 'r3',
    title: 'North Dorm Safety',
    content: "Street lights are out again. Walking back from late labs feels dangerous. Safety should be the priority of our administration.",
    status: 'Pending',
    likes: 1204,
    comments: 0,
    flags: 0,
    createdAt: '1d ago',
    authorId: 'u222',
    commentsList: []
  },
];

const Echo: React.FC<{ user: User }> = ({ user }) => {
  const [reports, setReports] = useState<EchoPost[]>(MOCK_REPORTS);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', image: '' });
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [activeCommentsPost, setActiveCommentsPost] = useState<EchoPost | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newLiked = new Set(likedPosts);
    const postIndex = reports.findIndex(r => r.id === id);
    if (postIndex === -1) return;

    const newReports = [...reports];
    if (newLiked.has(id)) {
      newLiked.delete(id);
      newReports[postIndex].likes--;
    } else {
      newLiked.add(id);
      newReports[postIndex].likes++;
    }
    setLikedPosts(newLiked);
    setReports(newReports);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost({ ...newPost, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddComment = () => {
    if (!newCommentText.trim() || !activeCommentsPost) return;
    
    const comment: EchoComment = {
      id: Date.now().toString(),
      text: newCommentText,
      user: 'You (Anonymous)',
      time: 'Just now'
    };

    const updatedReports = reports.map(r => {
      if (r.id === activeCommentsPost.id) {
        return {
          ...r,
          comments: r.comments + 1,
          commentsList: [comment, ...r.commentsList]
        };
      }
      return r;
    });

    setReports(updatedReports);
    setActiveCommentsPost({
      ...activeCommentsPost,
      comments: activeCommentsPost.comments + 1,
      commentsList: [comment, ...activeCommentsPost.commentsList]
    });
    setNewCommentText('');
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    const post: EchoPost = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      status: 'Pending',
      likes: 0,
      comments: 0,
      flags: 0,
      createdAt: 'Just now',
      authorId: user.id,
      imageUrl: newPost.image || undefined,
      commentsList: []
    };
    setReports([post, ...reports]);
    setNewPost({ title: '', content: '', image: '' });
    setShowForm(false);
  };

  return (
    <div className="h-screen bg-black md:bg-transparent overflow-hidden">
      {/* Desktop Header */}
      <div className="hidden md:block pt-12 pb-8 px-6">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Echo</h1>
        <p className="text-slate-400 font-medium">Campus community feed</p>
      </div>

      {/* Snap Container (Mobile: Full Screen, Desktop: Normal list) */}
      <div className="snap-y-container md:snap-none md:overflow-y-auto md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:px-6 md:pb-32 md:h-full">
        {reports.map((report) => (
          <div key={report.id} className="snap-section md:h-auto relative">
            <div className="h-full w-full relative bg-slate-900 md:bg-white md:rounded-[3rem] md:border md:border-slate-100 flex flex-col md:h-[600px] md:shadow-sm">
              {/* Background image/gradient */}
              <div className="absolute inset-0 md:rounded-[3rem] overflow-hidden pointer-events-none">
                 {report.imageUrl ? (
                   <img src={report.imageUrl} className="w-full h-full object-cover opacity-40 md:opacity-20 mix-blend-overlay" />
                 ) : (
                   <div className="w-full h-full bg-gradient-to-br from-slate-800 to-black md:from-slate-50 md:to-white" />
                 )}
                 <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 md:hidden" />
              </div>

              {/* Header Info */}
              <div className="relative p-8 pt-20 md:pt-8 flex justify-between items-start z-10">
                <span className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest border ${
                  report.status === 'Resolved' ? 'bg-green-500/20 text-green-400 border-green-500/30 md:bg-green-50 md:text-green-600' : 
                  report.status === 'Investigating' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 md:bg-blue-50 md:text-blue-600' :
                  'bg-orange-500/20 text-orange-400 border-orange-500/30 md:bg-orange-50 md:text-orange-600'
                }`}>
                  {report.status.toUpperCase()}
                </span>
                <span className="text-[10px] font-black text-slate-400">{report.createdAt}</span>
              </div>

              {/* Main Content */}
              <div className="relative flex-1 p-8 flex flex-col justify-end md:justify-start z-10">
                <h2 className="text-3xl md:text-2xl font-black text-white md:text-slate-800 mb-4 leading-tight">{report.title}</h2>
                <p className="text-lg md:text-sm text-slate-300 md:text-slate-500 leading-relaxed font-medium mb-12">
                  {report.content}
                </p>

                {/* Mobile Interaction Bar (Side) */}
                <div className="md:hidden absolute right-4 bottom-32 flex flex-col gap-8 items-center">
                  <InteractionBtn 
                    icon={<Heart fill={likedPosts.has(report.id) ? '#ef4444' : 'none'} />} 
                    count={report.likes} 
                    active={likedPosts.has(report.id)} 
                    color="text-red-500" 
                    onClick={(e) => toggleLike(report.id, e)}
                  />
                  <InteractionBtn 
                    icon={<MessageSquare />} 
                    count={report.comments} 
                    onClick={() => setActiveCommentsPost(report)}
                  />
                  <InteractionBtn icon={<Bookmark />} />
                  <InteractionBtn icon={<Share2 />} />
                </div>

                {/* Desktop Interaction Bar (Bottom) */}
                <div className="hidden md:flex items-center gap-6 pt-6 border-t border-slate-50 mt-auto">
                   <button onClick={(e) => toggleLike(report.id, e)} className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-black text-xs transition-colors">
                     <Heart size={18} fill={likedPosts.has(report.id) ? 'currentColor' : 'none'} /> {report.likes}
                   </button>
                   <button 
                    onClick={() => setActiveCommentsPost(report)}
                    className="flex items-center gap-2 text-slate-400 hover:text-purple-500 font-black text-xs transition-colors"
                   >
                     <MessageSquare size={18} /> {report.comments}
                   </button>
                   <button className="ml-auto text-slate-200 hover:text-slate-400"><AlertCircle size={18} /></button>
                </div>
              </div>

              {/* Post Creator (Simulated) */}
              <div className="relative p-8 pb-32 md:pb-8 flex items-center gap-4 z-10">
                 <div className="w-12 h-12 rounded-full bg-slate-700 md:bg-slate-100 flex items-center justify-center font-black text-white md:text-slate-400 text-sm overflow-hidden">
                   {report.imageUrl ? <img src={report.imageUrl} className="w-full h-full object-cover" /> : 'A'}
                 </div>
                 <div>
                   <p className="text-white md:text-slate-800 font-black text-sm">Anonymous User</p>
                   <p className="text-slate-400 text-xs">Verified Student</p>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comment Drawer (Instagram Style) */}
      <AnimatePresence>
        {activeCommentsPost && (
          <div className="fixed inset-0 z-[110] flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCommentsPost(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-white rounded-t-[3rem] h-[80vh] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-center py-4 border-b border-slate-100">
                <div className="w-12 h-1 bg-slate-200 rounded-full" />
              </div>
              <div className="px-8 py-4 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-800">Comments</h3>
                <button onClick={() => setActiveCommentsPost(null)} className="p-2 bg-slate-100 rounded-full text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                {activeCommentsPost.commentsList.length > 0 ? (
                  activeCommentsPost.commentsList.map((c) => (
                    <div key={c.id} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center font-bold text-slate-400 text-xs">
                        {c.user[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-slate-800">{c.user}</span>
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{c.time}</span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">{c.text}</p>
                        <div className="flex items-center gap-4 mt-2">
                           <button className="text-[10px] font-black text-slate-300 hover:text-slate-500">Reply</button>
                           <Heart size={12} className="text-slate-200" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50">
                    <MessageSquare size={48} className="mb-4" />
                    <p className="font-bold">No comments yet. Start the conversation!</p>
                  </div>
                )}
              </div>

              {/* Input section */}
              <div className="p-6 border-t border-slate-100 bg-white">
                <div className="flex items-center gap-4 bg-slate-50 rounded-2xl px-6 py-2 shadow-inner">
                  <input 
                    type="text" 
                    placeholder="Add a comment..." 
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    className="flex-1 bg-transparent border-none outline-none text-sm py-3 font-medium text-slate-800"
                  />
                  <button 
                    onClick={handleAddComment}
                    disabled={!newCommentText.trim()}
                    className="text-purple-600 font-black text-sm disabled:opacity-30 flex items-center gap-2"
                  >
                    Post <Send size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-slate-900">New Echo</h2>
                <button onClick={() => setShowForm(false)} className="p-2 bg-slate-50 rounded-full text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitPost} className="space-y-6">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Subject of report..."
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-purple-100"
                  />
                </div>
                <div>
                  <textarea
                    required
                    placeholder="Details about the issue..."
                    rows={4}
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-4 focus:ring-purple-100 resize-none"
                  />
                </div>

                {/* Image Upload Area */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video bg-slate-50 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer group hover:bg-slate-100 transition-colors overflow-hidden"
                >
                  {newPost.image ? (
                    <img src={newPost.image} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Camera className="text-slate-200 group-hover:text-purple-300 transition-colors mb-2" size={48} />
                      <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Attach Evidence</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleImageChange}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 py-5 bg-slate-900 text-white rounded-full font-black shadow-2xl shadow-slate-200">
                    Post Anonymously
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Plus Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowForm(true)}
        className="fixed bottom-32 right-8 w-16 h-16 bg-white md:bg-slate-900 text-slate-900 md:text-white rounded-full flex items-center justify-center shadow-2xl z-[100]"
      >
        <Plus size={32} />
      </motion.button>
    </div>
  );
};

const InteractionBtn = ({ icon, count, active, color, onClick }: any) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1 group">
    <div className={`p-4 rounded-full bg-white/10 backdrop-blur-md transition-all group-active:scale-90 ${active ? color : 'text-white'}`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    {count !== undefined && <span className="text-white text-[10px] font-black">{count}</span>}
  </button>
);

export default Echo;
