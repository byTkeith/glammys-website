
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, Navigate, Link, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Button } from './components/Button';
import { BookingModal } from './components/BookingModal';
import { Chatbot } from './components/Chatbot';
import { Room, TeamMember, FaqItem, Activity } from './types';
import { 
  Wifi, Star, ShieldCheck, MapPin, Mail, Phone, ChevronDown, 
  Plus, Minus, Hotel, Compass, Car, ChevronLeft, ChevronRight, 
  ExternalLink, Trash2, Save, BedDouble, Users, Settings, LogIn, User,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StorageService } from './services/storageService';
import { AdminLayout } from './components/AdminLayout';
import { HERO_IMAGE_URL, GALLERY_IMAGES, COMPANY_ADDRESS, COMPANY_EMAIL, COMPANY_PHONE } from './constants';

// --- SHARED COMPONENTS ---

const RoomCard = ({ room, index, onBook }: { room: Room; index: number; onBook: (r: Room) => void }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-gold-500/50 transition-all duration-300 shadow-xl flex flex-col h-full"
    >
      <div className="h-64 overflow-hidden relative bg-black">
        <AnimatePresence mode='wait'>
          <motion.img 
            key={currentImage}
            src={room.images[currentImage] || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800&auto=format&fit=crop'} 
            alt={room.name} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover absolute inset-0" 
          />
        </AnimatePresence>

        {room.images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-gold-500 hover:text-black text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-gold-500 hover:text-black text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {room.images.map((_, idx) => (
                <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImage ? 'bg-gold-500' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-4 right-4 bg-gold-500 text-black font-bold px-3 py-1 rounded text-sm z-20">
          R{room.price} / night
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <h3 className="font-serif text-2xl font-bold text-white mb-2">{room.name}</h3>
        <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-grow">{room.description}</p>
        <div className="flex flex-wrap gap-2 mb-6">
            {room.amenities.slice(0, 3).map(am => (
              <span key={am} className="text-[10px] bg-zinc-800 text-gold-300 px-2 py-1 rounded border border-gold-500/10 uppercase tracking-widest">
                {am}
              </span>
            ))}
        </div>
        <Button fullWidth onClick={() => onBook(room)}>Book This Suite</Button>
      </div>
    </motion.div>
  );
};

// --- PAGE COMPONENTS ---

const PublicWebsite = () => {
  const [rooms] = useState<Room[]>(StorageService.getRooms());
  const [team] = useState<TeamMember[]>(StorageService.getTeam());
  const [faqs] = useState<FaqItem[]>(StorageService.getFaqs());
  const [explore] = useState<Activity[]>(StorageService.getExplore());
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-richBlack text-gray-200 selection:bg-gold-500 selection:text-black font-sans">
      <Navbar />

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img src={HERO_IMAGE_URL} alt="Luxury Hotel" className="w-full h-full object-cover scale-105" />
           <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-richBlack" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          <motion.h2 
            initial={{ letterSpacing: "0.1em", opacity: 0 }}
            animate={{ letterSpacing: "0.4em", opacity: 1 }}
            className="text-gold-400 uppercase mb-6 text-sm font-bold"
          >
            Premium Accommodation in Sandton
          </motion.h2>
          <h1 className="font-serif text-5xl md:text-8xl font-bold text-white mb-8 leading-tight uppercase tracking-tighter">
            GLAMMYS<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-500 to-gold-200 italic">EXECUTIVE SUITES</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-12 font-light max-w-2xl mx-auto italic">
            Experience the pinnacle of luxury living in the heart of Johannesburg's business district.
          </p>
          <Button onClick={() => document.getElementById('suites')?.scrollIntoView({ behavior: 'smooth' })}>
            View Our Suites
          </Button>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-gold-500 z-10">
          <ChevronDown size={32} />
        </div>
      </header>

      {/* Rooms Section */}
      <section id="suites" className="py-32 px-6 container mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl font-bold text-white mb-4">Our Exclusive Suites</h2>
          <div className="w-24 h-1 bg-gold-500 mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {rooms.map((room, index) => (
            <RoomCard key={room.id} room={room} index={index} onBook={(r) => { setSelectedRoom(r); setIsBookingOpen(true); }} />
          ))}
        </div>
      </section>

      {/* Amenities Banner */}
      <section className="bg-zinc-950 py-24 border-y border-gold-500/10">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 mx-auto border border-gold-500/20"><Wifi size={32} /></div>
            <h4 className="text-xl font-serif font-bold text-white">High-Speed Fiber</h4>
            <p className="text-gray-500 text-sm">Stay connected with uncapped business-grade internet.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 mx-auto border border-gold-500/20"><Star size={32} /></div>
            <h4 className="text-xl font-serif font-bold text-white">5-Star Concierge</h4>
            <p className="text-gray-500 text-sm">Dedicated staff available 24/7 to fulfill your requests.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 mx-auto border border-gold-500/20"><ShieldCheck size={32} /></div>
            <h4 className="text-xl font-serif font-bold text-white">Secure Living</h4>
            <p className="text-gray-500 text-sm">Biometric access control and 24-hour security patrols.</p>
          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section id="explore" className="py-32 bg-richBlack">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <h2 className="font-serif text-5xl font-bold text-white mb-4">Explore Sandton</h2>
            <div className="w-24 h-1 bg-gold-500 rounded-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {explore.map((item, index) => (
              <motion.a 
                key={index}
                href={item.link}
                target="_blank"
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-gold-500/40 transition-all duration-500 block shadow-2xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="p-8">
                  <h3 className="font-serif text-2xl font-bold text-gold-500 mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">{item.description}</p>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
                    <span className="text-zinc-500 flex items-center gap-2"><MapPin size={12} className="text-gold-500"/> {item.distance}</span>
                    <span className="text-gold-500 group-hover:translate-x-1 transition-transform">Visit Site →</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-32 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl font-bold text-white mb-4">Executive Leadership</h2>
          <div className="w-24 h-1 bg-gold-500 mx-auto rounded-full" />
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-16">
          {team.map((member) => (
            <div key={member.id} className="text-center group max-w-sm">
              <div className="relative mb-8 inline-block">
                <div className="absolute inset-0 bg-gold-500 translate-x-4 translate-y-4 rounded-lg opacity-10 group-hover:opacity-30 transition-opacity -z-10" />
                <img src={member.image} alt={member.name} className="w-72 h-72 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all duration-700 shadow-2xl border border-zinc-800" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-white mb-2">{member.name}</h3>
              <p className="text-gold-500 text-xs uppercase font-bold tracking-[0.2em]">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 bg-zinc-950">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="font-serif text-4xl font-bold text-white text-center mb-16">Concierge FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-zinc-800 rounded-2xl overflow-hidden bg-black/40 hover:border-gold-500/20 transition-all">
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex justify-between items-center p-8 text-left"
                >
                  <span className={`font-bold text-lg transition-colors ${openFaq === index ? 'text-gold-400' : 'text-gray-300'}`}>{faq.question}</span>
                  <div className={`p-2 rounded-full transition-all ${openFaq === index ? 'bg-gold-500 text-black rotate-180' : 'bg-zinc-800 text-gold-500'}`}>
                    {openFaq === index ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-8 pt-0 text-gray-400 leading-relaxed border-t border-zinc-900 mt-2">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black pt-24 pb-12 border-t border-gold-500/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16 text-center md:text-left">
            <div>
              <h4 className="font-serif text-2xl font-bold text-gold-500 mb-6 uppercase">Glammys</h4>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Redefining luxury accommodation in Sandton. Where elegance meets convenience in Africa's golden square mile.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Contact Us</h4>
              <div className="space-y-4 text-gray-500 text-sm">
                <p className="flex items-center gap-3 justify-center md:justify-start"><Mail size={16} className="text-gold-500" /> {COMPANY_EMAIL}</p>
                <p className="flex items-center gap-3 justify-center md:justify-start"><Phone size={16} className="text-gold-500" /> +{COMPANY_PHONE}</p>
                <p className="flex items-center gap-3 justify-center md:justify-start"><MapPin size={16} className="text-gold-500" /> {COMPANY_ADDRESS}</p>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end justify-center">
              <Link to="/admin" className="text-zinc-800 hover:text-gold-500 text-xs flex items-center gap-2 transition-colors border border-zinc-800 hover:border-gold-500/50 px-4 py-2 rounded-full">
                <Settings size={12} /> Management Access
              </Link>
            </div>
          </div>
          <div className="pt-12 border-t border-zinc-900 text-center">
            <p className="text-gray-600 text-[10px] uppercase tracking-[0.3em]">
              &copy; {new Date().getFullYear()} GLAMMYS EXECUTIVE SUITES. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <BookingModal room={selectedRoom} isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <Chatbot />
    </div>
  );
};

// --- ADMIN COMPONENTS ---

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    // Small delay to feel more professional
    setTimeout(() => {
      if (StorageService.login(username, password)) {
        navigate('/admin');
      } else {
        setError('Authorization Failed: Credentials invalid.');
        setIsLoggingIn(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-richBlack flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_#1a1a1a,_#000)]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-charcoal p-10 rounded-3xl border border-gold-500/20 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-50" />
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-gold-500/20">
            <LogIn className="text-gold-500" size={32} />
          </div>
          <h2 className="font-serif text-3xl font-bold text-white mb-2 uppercase tracking-tighter">Admin Portal</h2>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] font-bold">Secure Access Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gold-500/70 ml-1 font-bold">Identity</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/40" size={18} />
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="w-full bg-black border border-zinc-800 rounded-xl px-12 py-4 text-white focus:border-gold-500 outline-none transition-all placeholder:text-zinc-800" 
                placeholder="admin"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gold-500/70 ml-1 font-bold">Access Key</label>
            <div className="relative">
              <Settings className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/40" size={18} />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-black border border-zinc-800 rounded-xl px-12 py-4 text-white focus:border-gold-500 outline-none transition-all placeholder:text-zinc-800" 
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-500 text-[10px] uppercase font-bold tracking-widest text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <Button fullWidth type="submit" disabled={isLoggingIn} className="h-14">
            {isLoggingIn ? 'Verifying...' : 'Authorize Access'}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/" className="text-zinc-700 hover:text-white text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
            <ChevronLeft size={12} /> Return to Website
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

const AdminDashboard = () => (
  <AdminLayout>
    <div className="max-w-4xl">
      <h1 className="text-5xl font-serif font-bold text-white mb-4">Welcome, Manager</h1>
      <p className="text-gray-500 text-lg mb-16 italic font-light">Overseeing excellence at Glammys Executive Suites.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link to="/admin/rooms" className="bg-charcoal p-10 rounded-3xl border border-gold-500/10 hover:border-gold-500 transition-all text-center group">
          <BedDouble className="text-gold-500 mx-auto mb-6 group-hover:scale-110 transition-transform" size={48} />
          <h3 className="text-2xl font-bold text-white">Inventory</h3>
          <p className="text-gray-500 text-sm mt-2">Manage suite data.</p>
        </Link>
        <Link to="/admin/team" className="bg-charcoal p-10 rounded-3xl border border-gold-500/10 hover:border-gold-500 transition-all text-center group">
          <Users className="text-gold-500 mx-auto mb-6 group-hover:scale-110 transition-transform" size={48} />
          <h3 className="text-2xl font-bold text-white">Leadership</h3>
          <p className="text-gray-500 text-sm mt-2">Update staff info.</p>
        </Link>
        <Link to="/admin/faq" className="bg-charcoal p-10 rounded-3xl border border-gold-500/10 hover:border-gold-500 transition-all text-center group">
          <MessageCircle className="text-gold-500 mx-auto mb-6 group-hover:scale-110 transition-transform" size={48} />
          <h3 className="text-2xl font-bold text-white">FAQ</h3>
          <p className="text-gray-500 text-sm mt-2">Concierge knowledge.</p>
        </Link>
      </div>
    </div>
  </AdminLayout>
);

const AdminRooms = () => {
  const [rooms, setRooms] = useState<Room[]>(StorageService.getRooms());
  const save = () => { StorageService.setRooms(rooms); alert('Changes deployed.'); };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-white">Manage Suites</h1>
        <Button onClick={save}><Save size={18} /> Deploy Changes</Button>
      </div>
      <div className="space-y-8">
        {rooms.map((room, idx) => (
          <div key={room.id} className="bg-charcoal border border-zinc-800 rounded-3xl p-8 hover:border-gold-500/20 transition-all">
            <input 
              className="text-2xl font-serif font-bold bg-transparent text-gold-500 w-full mb-6 outline-none border-b border-zinc-800 focus:border-gold-500 pb-2" 
              value={room.name} 
              onChange={(e) => { const nr = [...rooms]; nr[idx].name = e.target.value; setRooms(nr); }}
            />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 block">Nightly Price (ZAR)</label>
                <input 
                  type="number"
                  className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-white outline-none focus:border-gold-500"
                  value={room.price}
                  onChange={(e) => { const nr = [...rooms]; nr[idx].price = parseInt(e.target.value) || 0; setRooms(nr); }}
                />
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 block">Suite Description</label>
                <textarea 
                  className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-white h-40 outline-none focus:border-gold-500 text-sm leading-relaxed"
                  value={room.description}
                  onChange={(e) => { const nr = [...rooms]; nr[idx].description = e.target.value; setRooms(nr); }}
                />
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] uppercase tracking-widest text-zinc-500 block">Images Gallery (URLs)</label>
                 <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                   {room.images.map((img, iIdx) => (
                     <input key={iIdx} className="w-full bg-black border border-zinc-800 p-3 rounded text-xs text-zinc-400 outline-none focus:border-gold-500/30" value={img} onChange={(e) => {
                       const nr = [...rooms]; nr[idx].images[iIdx] = e.target.value; setRooms(nr);
                     }} />
                   ))}
                   <Button variant="outline" className="w-full h-10 text-[10px]" onClick={() => {
                     const nr = [...rooms]; nr[idx].images.push(''); setRooms(nr);
                   }}>Add Image Slot</Button>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return StorageService.isAuthenticated() ? <>{children}</> : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/rooms" element={<PrivateRoute><AdminRooms /></PrivateRoute>} />
        <Route path="/admin/team" element={<PrivateRoute><AdminLayout><div>Team Management Coming Soon</div></AdminLayout></PrivateRoute>} />
        <Route path="/admin/faq" element={<PrivateRoute><AdminLayout><div>FAQ Management Coming Soon</div></AdminLayout></PrivateRoute>} />
        <Route path="/admin/explore" element={<PrivateRoute><AdminLayout><div>Explore Management Coming Soon</div></AdminLayout></PrivateRoute>} />
        
        {/* CATCH ALL ROUTE: Always show the PublicWebsite for any other path */}
        <Route path="*" element={<PublicWebsite />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
