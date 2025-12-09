
import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Button } from './components/Button';
import { BookingModal } from './components/BookingModal';
import { Chatbot } from './components/Chatbot';
import { ROOMS, FAQS, TEAM, GALLERY_IMAGES, COMPANY_ADDRESS, COMPANY_EMAIL, COMPANY_PHONE, THINGS_TO_DO, HERO_IMAGE_URL } from './constants';
import { Room } from './types';
import { Wifi, Star, ShieldCheck, MapPin, Mail, Phone, ChevronDown, Plus, Minus, Hotel, Compass, Car, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Separate component for Room Card to handle slider state independently
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
        {/* Image Slider */}
        <AnimatePresence mode='wait'>
          <motion.img 
            key={currentImage}
            src={room.images[currentImage]} 
            alt={room.name} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover absolute inset-0" 
            onError={(e) => {
              // Fallback if specific image is missing
              e.currentTarget.src = 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800&auto=format&fit=crop';
            }}
          />
        </AnimatePresence>

        {/* Navigation Arrows */}
        {room.images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-gold-500 hover:text-black text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-gold-500 hover:text-black text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronRight size={20} />
            </button>
            {/* Dots Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {room.images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-1.5 h-1.5 rounded-full shadow-sm transition-colors ${idx === currentImage ? 'bg-gold-500' : 'bg-white/50'}`} 
                />
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
        
        <div className="mb-6">
          <p className="text-xs text-gold-500 uppercase tracking-widest mb-2 font-semibold">Amenities</p>
          <div className="flex flex-wrap gap-2">
            {room.amenities.slice(0, 4).map(am => (
              <span key={am} className="text-xs bg-zinc-800 text-gray-300 px-2 py-1 rounded border border-zinc-700">
                {am}
              </span>
            ))}
          </div>
        </div>

        <Button fullWidth onClick={() => onBook(room)}>Book This Suite</Button>
      </div>
    </motion.div>
  );
};

function App() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleBookClick = (room: Room) => {
    setSelectedRoom(room);
    setIsBookingOpen(true);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-richBlack text-gray-200 selection:bg-gold-500 selection:text-black font-sans">
        <Navbar />

        {/* Hero Section */}
        <header className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Replaced Background Image Style with Real IMG tag for robustness */}
          <div className="absolute inset-0 z-0">
             <img 
               src={HERO_IMAGE_URL} 
               alt="Luxury Hotel" 
               className="w-full h-full object-cover"
               onError={(e) => {
                 // Fallback to a generic luxury image if the local file is missing/broken
                 e.currentTarget.src = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop';
               }}
             />
             <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-richBlack" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          >
            <h2 className="text-gold-400 uppercase tracking-[0.3em] mb-4 text-sm md:text-base">Premium Accommodation in Sandton</h2>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              GLAMMYS<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300">EXECUTIVE SUITS</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-10 font-light max-w-2xl mx-auto">
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
        <section id="suites" className="py-24 px-6 container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-gold-500 mb-4">Our Exclusive Suites</h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto rounded-full" />
            <p className="mt-4 text-gray-400">Curated for comfort, designed for distinction.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ROOMS.map((room, index) => (
              <RoomCard key={room.id} room={room} index={index} onBook={handleBookClick} />
            ))}
          </div>
        </section>

        {/* Amenities Banner */}
        <section id="amenities" className="bg-zinc-900 py-16 border-y border-zinc-800">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 mb-4">
                <Wifi size={32} />
              </div>
              <h4 className="text-xl font-bold mb-2">High-Speed Fiber</h4>
              <p className="text-gray-400 text-sm">Stay connected with uncapped business-grade internet.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 mb-4">
                <Star size={32} />
              </div>
              <h4 className="text-xl font-bold mb-2">5-Star Concierge</h4>
              <p className="text-gray-400 text-sm">Dedicated staff available 24/7 to fulfill your requests.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 mb-4">
                <ShieldCheck size={32} />
              </div>
              <h4 className="text-xl font-bold mb-2">Secure Living</h4>
              <p className="text-gray-400 text-sm">Biometric access control and 24-hour security patrols.</p>
            </div>
          </div>
        </section>

         {/* Explore Sandton Section (NEW) */}
         <section id="explore" className="py-24 bg-gradient-to-b from-richBlack to-zinc-900">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between mb-16">
              <div>
                <h2 className="font-serif text-4xl font-bold text-white mb-2">Explore Sandton</h2>
                <div className="w-24 h-1 bg-gold-500 rounded-full" />
              </div>
              <p className="mt-4 md:mt-0 text-gray-400 max-w-md text-right">
                Glammys is perfectly positioned minutes away from Africa's most prestigious shopping and dining destinations.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {THINGS_TO_DO.map((item, index) => (
                <motion.a 
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-black border border-gold-500/20 rounded-lg overflow-hidden group hover:border-gold-500/60 transition-colors block cursor-pointer"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?q=80&w=800&auto=format&fit=crop'; }}
                    />
                    <div className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink size={14} />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="font-serif text-xl font-bold text-gold-500 group-hover:underline decoration-gold-500/50 underline-offset-4 transition-all">{item.title}</h3>
                       <div className="flex items-center gap-1 text-xs text-gray-500 bg-zinc-900 px-2 py-1 rounded">
                         <Compass size={12} />
                         {item.distance}
                       </div>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-24 bg-black">
          <div className="container mx-auto px-6">
             <div className="flex flex-col md:flex-row justify-between items-end mb-12">
               <div>
                 <h2 className="font-serif text-4xl font-bold text-white">The Glammys Experience</h2>
                 <p className="text-gold-500 mt-2">A visual tour of our property.</p>
               </div>
               <Button variant="outline" className="mt-4 md:mt-0">View All Photos</Button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {GALLERY_IMAGES.map((img, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0 }}
                   whileInView={{ opacity: 1 }}
                   transition={{ delay: i * 0.1 }}
                   className={`relative overflow-hidden rounded-lg cursor-pointer group ${i === 0 || i === 3 ? 'md:col-span-2' : ''}`}
                 >
                   <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                      <span className="text-gold-500 uppercase tracking-widest text-sm font-bold border border-gold-500 px-4 py-2">View</span>
                   </div>
                   <img 
                      src={img} 
                      alt="Gallery" 
                      className="w-full h-64 md:h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800&auto=format&fit=crop'; }}
                   />
                 </motion.div>
               ))}
             </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section id="team" className="py-24 container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-gold-500">Executive Leadership</h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto rounded-full mt-4" />
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-12">
            {TEAM.map((member) => (
              <div key={member.id} className="text-center group max-w-xs">
                <div className="relative w-64 h-64 mx-auto mb-6 rounded-lg overflow-hidden border-2 border-zinc-800 group-hover:border-gold-500 transition-colors shadow-2xl">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/1a1a1a/D4A32B?text=Leader'; }}
                  />
                </div>
                <h3 className="text-2xl font-serif font-bold text-white">{member.name}</h3>
                <p className="text-gold-500 text-sm uppercase tracking-wider mt-2 font-bold">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-zinc-900">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="font-serif text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQS.map((faq, index) => (
                <div key={index} className="border border-zinc-700 rounded-lg overflow-hidden bg-zinc-950">
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center p-6 text-left hover:bg-zinc-900 transition-colors"
                  >
                    <span className="font-semibold text-lg text-gray-200">{faq.question}</span>
                    {openFaq === index ? <Minus className="text-gold-500" /> : <Plus className="text-gold-500" />}
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-zinc-800">
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
        <footer className="bg-black pt-16 pb-8 border-t border-gold-500/20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-1">
                 <div className="flex items-center gap-2 text-gold-500 mb-6">
                  <Hotel className="w-8 h-8" />
                  <span className="font-serif text-xl font-bold">GLAMMYS</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Redefining luxury accommodation in Sandton. Where elegance meets convenience.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-bold mb-6">Contact</h4>
                <ul className="space-y-4 text-sm text-gray-400">
                  <li className="flex items-start gap-3">
                    <MapPin className="text-gold-500 w-5 h-5 shrink-0" />
                    <span>{COMPANY_ADDRESS}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="text-gold-500 w-5 h-5 shrink-0" />
                    <span>+{COMPANY_PHONE}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="text-gold-500 w-5 h-5 shrink-0" />
                    <span>{COMPANY_EMAIL}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-6">Quick Links</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#suites" className="hover:text-gold-500">Suites</a></li>
                  <li><a href="#explore" className="hover:text-gold-500">Things To Do</a></li>
                  <li><a href="#amenities" className="hover:text-gold-500">Amenities</a></li>
                  <li><a href="#gallery" className="hover:text-gold-500">Gallery</a></li>
                </ul>
              </div>

              <div>
                 <h4 className="text-white font-bold mb-6">Newsletter</h4>
                 <p className="text-gray-500 text-sm mb-4">Subscribe for exclusive offers.</p>
                 <div className="flex">
                   <input type="email" placeholder="Email Address" className="bg-zinc-900 text-white px-4 py-2 rounded-l w-full border border-zinc-700 focus:border-gold-500 focus:outline-none" />
                   <button className="bg-gold-500 text-black px-4 py-2 rounded-r hover:bg-gold-400 font-bold">OK</button>
                 </div>
              </div>
            </div>

            <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
              <p>&copy; {new Date().getFullYear()} Glammys Executive Suits. All rights reserved.</p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <a href="#" className="hover:text-gold-500">Privacy Policy</a>
                <a href="#" className="hover:text-gold-500">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>

        <BookingModal 
          room={selectedRoom} 
          isOpen={isBookingOpen} 
          onClose={() => setIsBookingOpen(false)} 
        />
        
        <Chatbot />
      </div>
    </HashRouter>
  );
}

export default App;