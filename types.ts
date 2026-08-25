
export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  amenities: string[];
  maxGuests: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Activity {
  title: string;
  description: string;
  image: string;
  distance: string;
  link: string;
}

export interface BookingDetails {
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
}

export interface Promotion {
  id: string;
  title: string;
  tagline: string; // e.g. "December Disease Special", "Weekday Madness"
  description: string;
  discountPercentage: number;
  code?: string;
  isActive: boolean;
  highlightText?: string; // e.g. "Up to 20% OFF"
}

export enum ChatSender {
  USER = 'user',
  BOT = 'bot'
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: ChatSender;
  timestamp: Date;
}
