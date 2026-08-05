import { Room, TeamMember, FaqItem, Activity } from '../types';
import { ROOMS, TEAM, FAQS, THINGS_TO_DO } from '../constants';

const STORAGE_KEYS = {
  ROOMS: 'glammys_rooms',
  TEAM: 'glammys_team',
  FAQS: 'glammys_faqs',
  EXPLORE: 'glammys_explore',
  AUTH: 'glammys_auth'
};

// Helper function to notify open website components when Admin data changes
const notifyUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('glammys-data-updated'));
  }
};

export const StorageService = {
  // --- ROOMS ---
  getRooms: (): Room[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ROOMS);
    return data ? JSON.parse(data) : ROOMS;
  },
  setRooms: (data: Room[]) => {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(data));
    notifyUpdate();
  },

  // --- TEAM ---
  getTeam: (): TeamMember[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TEAM);
    return data ? JSON.parse(data) : TEAM;
  },
  setTeam: (data: TeamMember[]) => {
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(data));
    notifyUpdate();
  },

  // --- FAQS ---
  getFaqs: (): FaqItem[] => {
    const data = localStorage.getItem(STORAGE_KEYS.FAQS);
    return data ? JSON.parse(data) : FAQS;
  },
  setFaqs: (data: FaqItem[]) => {
    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(data));
    notifyUpdate();
  },

  // --- EXPLORE ---
  getExplore: (): Activity[] => {
    const data = localStorage.getItem(STORAGE_KEYS.EXPLORE);
    return data ? JSON.parse(data) : THINGS_TO_DO;
  },
  setExplore: (data: Activity[]) => {
    localStorage.setItem(STORAGE_KEYS.EXPLORE, JSON.stringify(data));
    notifyUpdate();
  },

  // --- AUTHENTICATION ---
  login: (username: string, password: string): boolean => {
    const cleanUsername = (username || '').toLowerCase().trim();
    const cleanPassword = (password || '').trim();
    
    if (cleanUsername === 'admin' && cleanPassword === 'glammys2025') {
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      return true;
    }
    return false;
  },
  logout: () => localStorage.removeItem(STORAGE_KEYS.AUTH),
  isAuthenticated: (): boolean => localStorage.getItem(STORAGE_KEYS.AUTH) === 'true',

  // --- IMAGE UPLOAD HELPER ---
  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }
};
