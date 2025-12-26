
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
  MessageCircle, Eye, EyeOff
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 0.45, 0.32, 0.9] }}
      className="group relative bg-zinc-900/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-zinc-800 hover:border-gold-500/40 transition-all duration-500 shadow-2xl flex flex-col h-full"
    >
      <div className="h-72 overflow-hidden relative bg-black">
        <AnimatePresence mode='wait'>
          <motion.img 
            key={currentImage}
            src={room.images[currentImage] || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800&auto=format&fit=crop'} 
            alt={room.name} 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7 }}
            className="w-full h-full object-cover absolute inset-0" 
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {room.images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md hover:bg-gold-500 hover:text-black text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md hover:bg-gold-500 hover:text-black text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {room.images.map((_, idx) => (
                <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentImage ? 'bg-gold-500 w-4' : 'bg-white/30'}`} />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-4 right-4 bg-gradient-to-br from-gold-400 to-gold-600 text-richBlack font-black px-4 py-1.5 rounded-lg text-sm z-20 shadow-lg">
          R{room.price} <span className="text-[10px] font-bold opacity-80">/ night</span>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <h3 className="font-serif text-2xl font-bold text-white mb-3 group-hover:text-gold-400 transition-colors">{room.name}</h3>
        <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-grow leading-relaxed">{room.description}</p>
        <div className="flex flex-wrap gap-2 mb-8">
            {room.amenities.slice(0, 4).map(am => (
              <span key={am} className="text-[9px] bg-zinc-800/80 text-gold-300 px-3 py-1 rounded-full border border-gold-500/10 uppercase tracking-[0.15em] font-bold">
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
           <motion.img 
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, ease: "easeOut" }}
              src={HERO_IMAGE_URL} 
              alt="Luxury Hotel" 
              className="w-full h-full object-cover" 
           />
           <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-richBlack" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.21, 0.45, 0.32, 0.9] }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent mb-8"
          />
          <motion.h2 
            initial={{ letterSpacing: "0.1em", opacity: 0 }}
            animate={{ letterSpacing: "0.5em", opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="text-gold-400 uppercase mb-8 text-xs md:text-sm font-black tracking-[0.5em]"
          >
            Refined Living in the heart of Sandton
          </motion.h2>
          <h1 className="font-serif text-6xl md:text-9xl font-bold text-white mb-10 leading-none uppercase tracking-tighter">
            GLAMMYS<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-500 to-gold-200 italic font-medium">EXECUTIVE</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-2xl mb-14 font-light max-w-2xl mx-auto italic tracking-wide">
            "Your home away from home, redefined with golden standards of hospitality."
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="h-14 px-10" onClick={() => document.getElementById('suites')?.scrollIntoView({ behavior: 'smooth' })}>
              Discover Suites
            </Button>
            <Button variant="outline" className="h-14 px-10" onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Sandton
            </Button>
          </div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-gold-500 z-10 opacity-50">
          <ChevronDown size={32} />
        </div>
      </header>

      {/* Intro Section */}
      <section className="py-32 px-6 bg-zinc-950 border-y border-gold-500/10">
        <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-gold-500 uppercase tracking-[0.3em] text-xs font-bold">Unparalleled Luxury</h2>
              <p className="font-serif text-3xl md:text-5xl text-white leading-tight">
                Combining the comfort of home with the <span className="text-gold-400 italic">prestige of a world-class hotel</span>.
              </p>
              <p className="text-gray-500 text-lg font-light leading-relaxed">
                Whether for a high-stakes business trip or a tranquil city getaway, Glammys Executive Suites provides a sanctuary of peace and productivity at 86 & 89 Grayston Drive.
              </p>
            </motion.div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="suites" className="py-32 px-6 container mx-auto">
        <div className="text-center mb-24">
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-white mb-6">Signature Collection</h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {rooms.map((room, index) => (
            <RoomCard key={room.id} room={room} index={index} onBook={(r) => { setSelectedRoom(r); setIsBookingOpen(true); }} />
          ))}
        </div>
      </section>

      {/* Explore Section */}
      <section id="explore" className="py-32 bg-richBlack">
        <div className="container mx-auto px-6">
          <div className="mb-20 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h2 className="font-serif text-5xl md:text-6xl font-bold text-white mb-4">The Golden Square Mile</h2>
              <p className="text-gold-500 uppercase tracking-widest text-xs font-bold">Discover Sandton's Best Attractions</p>
            </div>
            <div className="hidden md:block w-48 h-px bg-gold-500/30" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {explore.map((item, index) => (
              <motion.a 
                key={index}
                href={item.link}
                target="_blank"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 rounded-3xl overflow-hidden group hover:border-gold-500/40 transition-all duration-700 block shadow-2xl"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                </div>
                <div className="p-8 relative">
                  <h3 className="font-serif text-2xl font-bold text-white mb-3 group-hover:text-gold-400 transition-colors">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-8 leading-relaxed font-light">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
                      <MapPin size={12} className="text-gold-500"/> {item.distance}
                    </span>
                    <span className="text-gold-500 text-[10px] uppercase tracking-widest font-black border-b border-gold-500/0 group-hover:border-gold-500 transition-all">
                      Visit Site →
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 bg-zinc-950/50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-20">
            <h2 className="font-serif text-5xl font-bold text-white mb-6">Concierge Inquiries</h2>
            <p className="text-gray-500 font-light">Frequently asked questions about your upcoming stay.</p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-zinc-800 rounded-3xl overflow-hidden bg-black/20 hover:bg-black/40 hover:border-gold-500/30 transition-all group">
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex justify-between items-center p-8 text-left"
                >
                  <span className={`font-bold text-lg md:text-xl transition-colors ${openFaq === index ? 'text-gold-400' : 'text-gray-300'}`}>{faq.question}</span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${openFaq === index ? 'bg-gold-500 text-richBlack rotate-180' : 'bg-zinc-900 text-gold-500 group-hover:bg-gold-500/10'}`}>
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
                      <div className="p-8 pt-0 text-gray-400 leading-relaxed border-t border-zinc-900 mx-8">
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
      <footer className="bg-black pt-32 pb-16 border-t border-gold-500/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 md:col-span-2">
              <h4 className="font-serif text-4xl font-bold text-white mb-8 tracking-tighter">GLAMMYS</h4>
              <p className="text-gray-500 text-lg leading-relaxed max-w-md font-light italic">
                "Where elegance meets convenience in Africa's golden square mile. We offer more than a room; we offer an experience of unparalleled comfort."
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8 opacity-50">Reservations</h4>
              <div className="space-y-6 text-gray-400 text-sm">
                <p className="flex items-center gap-4 hover:text-gold-400 transition-colors cursor-pointer"><Mail size={16} className="text-gold-500" /> {COMPANY_EMAIL}</p>
                <p className="flex items-center gap-4 hover:text-gold-400 transition-colors cursor-pointer"><Phone size={16} className="text-gold-500" /> +{COMPANY_PHONE}</p>
                <p className="flex items-start gap-4 hover:text-gold-400 transition-colors cursor-pointer"><MapPin size={16} className="text-gold-500 mt-1" /> {COMPANY_ADDRESS}</p>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <Link to="/admin" className="text-zinc-800 hover:text-gold-500 text-[10px] font-black uppercase tracking-widest transition-all border border-zinc-900 hover:border-gold-500/30 px-6 py-3 rounded-full flex items-center gap-2">
                <Settings size={14} /> Management
              </Link>
            </div>
          </div>
          <div className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-600 text-[10px] uppercase tracking-[0.5em] font-bold">
              &copy; {new Date().getFullYear()} GLAMMYS EXECUTIVE SUITES.
            </p>
            <div className="flex gap-8">
              <span className="text-[10px] text-zinc-700 uppercase tracking-widest cursor-pointer hover:text-gold-500 transition-colors">Privacy Policy</span>
              <span className="text-[10px] text-zinc-700 uppercase tracking-widest cursor-pointer hover:text-gold-500 transition-colors">Terms of Stay</span>
            </div>
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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    // Explicitly use Trim to ensure no whitespace errors
    setTimeout(() => {
      if (StorageService.login(username, password)) {
        navigate('/admin');
      } else {
        setError('Authorization Failed: Identity or Access Key is incorrect.');
        setIsLoggingIn(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-richBlack flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_#1c1c1c_0%,_#000000_100%)]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-charcoal/80 backdrop-blur-xl p-12 rounded-[2.5rem] border border-gold-500/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-40" />
        
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gold-500/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-gold-500/10 shadow-inner">
            <LogIn className="text-gold-500" size={36} />
          </div>
          <h2 className="font-serif text-4xl font-bold text-white mb-3 uppercase tracking-tighter">Executive Portal</h2>
          <p className="text-gray-600 text-[10px] uppercase tracking-[0.5em] font-black">Authorized Access Required</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-[0.3em] text-gold-500/60 ml-1 font-black">Manager ID</label>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500/30 group-focus-within:text-gold-500 transition-colors" size={20} />
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-14 py-5 text-white focus:border-gold-500 outline-none transition-all placeholder:text-zinc-800 shadow-inner" 
                placeholder="admin"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-[0.3em] text-gold-500/60 ml-1 font-black">Access Key</label>
            <div className="relative group">
              <Settings className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500/30 group-focus-within:text-gold-500 transition-colors" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-14 py-5 text-white focus:border-gold-500 outline-none transition-all placeholder:text-zinc-800 shadow-inner" 
                placeholder="••••••••"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-gold-500 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 py-4 px-6 rounded-2xl"
              >
                <p className="text-red-500 text-[10px] uppercase font-black tracking-widest text-center">
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <Button fullWidth type="submit" disabled={isLoggingIn} className="h-16 rounded-2xl font-black text-lg">
            {isLoggingIn ? (
              <span className="flex items-center gap-3">
                <span className="w-5 h-5 border-2 border-richBlack/20 border-t-richBlack rounded-full animate-spin" />
                Authorizing...
              </span>
            ) : 'Enter Portal'}
          </Button>
        </form>

        <div className="mt-12 text-center">
          <Link to="/" className="text-zinc-600 hover:text-white text-[10px] uppercase tracking-[0.4em] font-black transition-all flex items-center justify-center gap-3 group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Return to Sanctuary
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

const AdminDashboard = () => (
  <AdminLayout>
    <div className="max-w-5xl">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-6xl font-serif font-bold text-white mb-4">Master View</h1>
        <p className="text-gray-500 text-xl mb-16 italic font-light tracking-wide">Orchestrating the golden standard of Glammys Executive Suites.</p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { to: "/admin/rooms", icon: <BedDouble size={48} />, label: "Inventory", desc: "Suites & Availability" },
          { to: "/admin/team", icon: <Users size={48} />, label: "Leadership", desc: "Executive Profiles" },
          { to: "/admin/faq", icon: <MessageCircle size={48} />, label: "Concierge", desc: "Guest FAQ Database" }
        ].map((item, idx) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
          >
            <Link to={item.to} className="bg-charcoal/50 p-12 rounded-[2rem] border border-zinc-800 hover:border-gold-500 transition-all text-center group block">
              <div className="text-gold-500 mx-auto mb-8 group-hover:scale-110 transition-transform bg-gold-500/5 w-24 h-24 rounded-3xl flex items-center justify-center border border-gold-500/10">
                {item.icon}
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{item.label}</h3>
              <p className="text-gray-600 text-sm uppercase tracking-widest font-bold">{item.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </AdminLayout>
);

const AdminRooms = () => {
  const [rooms, setRooms] = useState<Room[]>(StorageService.getRooms());
  const save = () => { StorageService.setRooms(rooms); alert('Global inventory updated.'); };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div>
          <h1 className="text-5xl font-serif font-bold text-white mb-2">Suites Inventory</h1>
          <p className="text-gray-500 font-light italic">Configure nightly rates and presentation details.</p>
        </div>
        <Button onClick={save} className="h-14 px-10"><Save size={20} /> Deploy Changes</Button>
      </div>
      <div className="space-y-12 pb-20">
        {rooms.map((room, idx) => (
          <motion.div 
            key={room.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-charcoal/40 backdrop-blur-md border border-zinc-800 rounded-[2.5rem] p-10 hover:border-gold-500/20 transition-all shadow-xl"
          >
            <div className="flex flex-col xl:flex-row gap-12">
              <div className="w-full xl:w-1/3">
                 <div className="relative aspect-video rounded-3xl overflow-hidden border border-zinc-800">
                    <img src={room.images[0]} className="w-full h-full object-cover grayscale-[0.5] opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <span className="bg-black/80 backdrop-blur-md text-gold-500 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">Master Preview</span>
                    </div>
                 </div>
              </div>
              <div className="flex-1 space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-gold-500/50 font-black">Suite Title</label>
                  <input 
                    className="text-3xl font-serif font-bold bg-transparent text-white w-full outline-none border-b border-zinc-800 focus:border-gold-500 pb-3 transition-colors" 
                    value={room.name} 
                    onChange={(e) => { const nr = [...rooms]; nr[idx].name = e.target.value; setRooms(nr); }}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gold-500/50 font-black">Nightly Rate (ZAR)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500 font-bold">R</span>
                      <input 
                        type="number"
                        className="w-full bg-black/40 border border-zinc-800 pl-10 pr-5 py-4 rounded-2xl text-white outline-none focus:border-gold-500 transition-colors font-bold"
                        value={room.price}
                        onChange={(e) => { const nr = [...rooms]; nr[idx].price = parseInt(e.target.value) || 0; setRooms(nr); }}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-gold-500/50 font-black">Max Occupancy</label>
                    <input 
                      type="number"
                      className="w-full bg-black/40 border border-zinc-800 p-4 rounded-2xl text-white outline-none focus:border-gold-500 transition-colors"
                      value={room.maxGuests}
                      onChange={(e) => { const nr = [...rooms]; nr[idx].maxGuests = parseInt(e.target.value) || 0; setRooms(nr); }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-gold-500/50 font-black">Marketing Description</label>
                  <textarea 
                    className="w-full bg-black/40 border border-zinc-800 p-5 rounded-2xl text-white h-40 outline-none focus:border-gold-500 transition-colors text-sm leading-relaxed font-light"
                    value={room.description}
                    onChange={(e) => { const nr = [...rooms]; nr[idx].description = e.target.value; setRooms(nr); }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
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
        <Route path="/admin/team" element={<PrivateRoute><AdminLayout><div>Executive Team Management Interface (Coming Soon)</div></AdminLayout></PrivateRoute>} />
        <Route path="/admin/faq" element={<PrivateRoute><AdminLayout><div>Concierge FAQ Management Interface (Coming Soon)</div></AdminLayout></PrivateRoute>} />
        <Route path="/admin/explore" element={<PrivateRoute><AdminLayout><div>Attractions Management Interface (Coming Soon)</div></AdminLayout></PrivateRoute>} />
        
        {/* CATCH ALL ROUTE */}
        <Route path="*" element={<PublicWebsite />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
