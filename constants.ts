import { Room, TeamMember, FaqItem, Activity } from './types';

// ==========================================
// COMPANY BRANDING & DETAILS
// ==========================================
export const COMPANY_NAME = "GLAMMYS EXECUTIVE SUITS";
export const COMPANY_PHONE = "27633175581"; // Format: CountryCode + Number (No + symbol)
export const COMPANY_EMAIL = "reservations@glammys.co.za";
export const COMPANY_ADDRESS = "Hydro Park & Westpoint, Sandton, Johannesburg";

// 2. CHANGE YOUR LANDING PAGE (HERO) IMAGE HERE
export const HERO_IMAGE_URL = "/images/hero.jpg";

// LOGO SETUP:
export const COMPANY_LOGO_URL = "/images/logo.png"; 

// ==========================================
// ROOMS CONFIGURATION
// ==========================================
export const ROOMS: Room[] = [
  {
    id: 'hydro-1bed',
    name: '1 Bedroom Executive Suite @ Hydro Park',
    description: 'A sleek, modern sanctuary perfect for the solo business traveller. High-end finishes, open plan living, and immediate access to Sandton CBD.',
    price: 1100,
    images: [
      '/images/rooms/bedroom HY 4.jpg',
      '/images/rooms/bedroom HY 1.jpeg',
      '/images/rooms/kitchen HY 1.jpeg',
      '/images/rooms/lounge HY 1.jpeg',
      '/images/rooms/tub HY 1.jpeg'
    ],
    amenities: ['Queen Bed', 'Fiber Wi-Fi', 'Workstation', 'En-suite', 'Pool Access'],
    maxGuests: 2
  },
  {
    id: 'hydro-2bed',
    name: '2 Bedroom Executive Suite @ Hydro Park',
    description: 'Spacious luxury with dual en-suite bedrooms. Features a full designer kitchen, private balcony, and sophisticated lounge area.',
    price: 1700,
    images: [
      '/images/rooms/lounge HY 2.jpg',
      '/images/rooms/kitchen HY 2.jpg',
      '/images/rooms/HY tub2.jpg',
      '/images/rooms/HY lounge 3.jpg',
    ],
    amenities: ['2 En-suite Rooms', 'Full Kitchen', 'Balcony', 'Smart TV', 'Secure Parking'],
    maxGuests: 4
  },
  {
    id: 'westpoint-2bed',
    name: '2 Bedroom Exec Unit @ Westpoint',
    description: 'The epitome of executive living. Offers panoramic views, concierge service, and premium furniture fittings for long or short stays.',
    price: 1500,
    images: [
      '/images/rooms/kitchen wp 1.jpeg',
      '/images/rooms/tv wp.jpg',
      '/images/rooms/IMG-20251208-WA0086.jpg',
      '/images/rooms/bedroom HY 3.jpg',
      '/images/rooms/dining 3.jpeg',
      '/images/rooms/dining.jpeg'

    ],
    amenities: ['Panoramic Views', '24hr Concierge', 'Gym Access', 'Heated Pool', 'Dining Area'],
    maxGuests: 4
  }
];

// ==========================================
// LEADERSHIP TEAM
// ==========================================
export const TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Pamela S.N Silungwe',
    role: 'Executive Director',
    image: '/images/team/pamela.jpg'
  },
  {
    id: '2',
    name: 'Tendai K. Nyevedzanai',
    role: 'Chief Technology Officer',
    image: '/images/team/tendai.jpg'
  }
];

// ==========================================
// THINGS TO DO (EXPLORE)
// ==========================================
export const THINGS_TO_DO: Activity[] = [
  {
    title: "Sandton City & Nelson Mandela Square",
    description: "Africa's most prestigious shopping destination featuring world-class dining, high-end fashion brands, and the iconic Nelson Mandela statue.",
    image: "/images/activities/mandela-square.jpg",
    distance: "5 min drive"
  },
  {
    title: "The Leonardo - Alto234",
    description: "Visit the highest urban bar in Africa. Enjoy 360-degree views of Johannesburg while sipping on signature cocktails at sunset.",
    image: "/images/activities/leonardo.jpg",
    distance: "3 min drive"
  },
  {
    title: "Mushroom Farm Park",
    description: "A green lung in the center of the city. Perfect for morning jogs, picnics, or taking a ride in the giant Hyundai hot air balloon.",
    image: "/images/activities/park.jpg",
    distance: "Walking distance"
  }
];

// ==========================================
// FREQUENTLY ASKED QUESTIONS
// ==========================================
export const FAQS: FaqItem[] = [
  {
    question: "What is the difference between Hydro Park and Westpoint units?",
    answer: "Both are premium buildings. Hydro Park is known for its modern artistic flair and central location, while Westpoint offers extensive resort-style facilities including a large heated pool and gym."
  },
  {
    question: "Do you offer airport shuttles?",
    answer: "Yes, we offer a premium shuttle service to and from O.R. Tambo International Airport. Please request this when booking."
  },
  {
    question: "Is there secure parking available?",
    answer: "Absolutely. Both Hydro Park and Westpoint provide 24-hour secure underground parking for all our guests."
  },
  {
    question: "What time is check-in and check-out?",
    answer: "Check-in is from 14:00 PM, and check-out is strictly at 11:00 AM."
  }
];

// ==========================================
// GALLERY IMAGES
// ==========================================
export const GALLERY_IMAGES = [
  '/images/gallery/pool HY.jpg',
  '/images/gallery/fireplace.jpeg',
  '/images/gallery/dining HY .jpg',
  '/images/gallery/lounge HY 7.jpg',
  '/images/gallery/view wp 2.jpg',
  '/images/gallery/corridor HY.jpg',
  '/images/gallery/gym.jpg',
  '/images/gallery/pool.jpg',
  '/images/gallery/view hp pool.jpg',
  '/images/gallery/HY pool.jpg'
];