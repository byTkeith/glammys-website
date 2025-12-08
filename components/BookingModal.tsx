import React, { useState } from 'react';
import { X, Calendar, User, Users } from 'lucide-react';
import { Button } from './Button';
import { Room, BookingDetails } from '../types';
import { COMPANY_PHONE } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ room, isOpen, onClose }) => {
  const [details, setDetails] = useState<BookingDetails>({
    roomName: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    guestName: ''
  });

  // Reset or Set Room Name when modal opens
  React.useEffect(() => {
    if (room) {
      setDetails(prev => ({ ...prev, roomName: room.name }));
    }
  }, [room]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = `Hello Glammys Executive Suits,%0A%0AI would like to book the following:%0A%0A*Room:* ${details.roomName}%0A*Name:* ${details.guestName}%0A*Guests:* ${details.guests}%0A*Check-in:* ${details.checkIn}%0A*Check-out:* ${details.checkOut}%0A%0APlease confirm availability.`;
    
    const whatsappUrl = `https://wa.me/${COMPANY_PHONE}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-zinc-900 border border-gold-500/30 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gold-500 p-4 flex justify-between items-center text-richBlack">
              <h3 className="font-serif font-bold text-xl">Secure Your Stay</h3>
              <button onClick={onClose} className="hover:text-white transition-colors">
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-gray-200">
              {room && (
                 <div className="mb-4">
                   <p className="text-sm text-gold-500 uppercase tracking-widest">Selected Suite</p>
                   <p className="text-xl font-serif">{room.name}</p>
                   <p className="text-sm text-gray-400">R{room.price} / night</p>
                 </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gold-500 w-5 h-5" />
                  <input 
                    required
                    type="text" 
                    className="w-full bg-black/30 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:border-gold-500 focus:outline-none"
                    placeholder="John Doe"
                    value={details.guestName}
                    onChange={e => setDetails({...details, guestName: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Check In</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gold-500 w-5 h-5" />
                    <input 
                      required
                      type="date" 
                      className="w-full bg-black/30 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:border-gold-500 focus:outline-none"
                      value={details.checkIn}
                      onChange={e => setDetails({...details, checkIn: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Check Out</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gold-500 w-5 h-5" />
                    <input 
                      required
                      type="date" 
                      className="w-full bg-black/30 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:border-gold-500 focus:outline-none"
                      value={details.checkOut}
                      onChange={e => setDetails({...details, checkOut: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Guests</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 text-gold-500 w-5 h-5" />
                  <input 
                    required
                    type="number" 
                    min="1"
                    max={room?.maxGuests || 5}
                    className="w-full bg-black/30 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:border-gold-500 focus:outline-none"
                    value={details.guests}
                    onChange={e => setDetails({...details, guests: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button fullWidth type="submit">Proceed to WhatsApp</Button>
                <p className="text-xs text-center text-gray-500 mt-2">You will be redirected to WhatsApp to confirm details with our concierge.</p>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};