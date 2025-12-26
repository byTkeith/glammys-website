
import { Room, TeamMember, FaqItem, Activity } from '../types';
import { ROOMS, TEAM, FAQS, THINGS_TO_DO } from '../constants';

const STORAGE_KEYS = {
  ROOMS: 'glammys_rooms',
  TEAM: 'glammys_team',
  FAQS: 'glammys_faqs',
  EXPLORE: 'glammys_explore',
  AUTH: 'glammys_auth'
};

export const StorageService = {
  getRooms: (): Room[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ROOMS);
    return data ? JSON.parse(data) : ROOMS;
  },
  setRooms: (data: Room[]) => localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(data)),

  getTeam: (): TeamMember[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TEAM);
    return data ? JSON.parse(data) : TEAM;
  },
  setTeam: (data: TeamMember[]) => localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(data)),

  getFaqs: (): FaqItem[] => {
    const data = localStorage.getItem(STORAGE_KEYS.FAQS);
    return data ? JSON.parse(data) : FAQS;
  },
  setFaqs: (data: FaqItem[]) => localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(data)),

  getExplore: (): Activity[] => {
    const data = localStorage.getItem(STORAGE_KEYS.EXPLORE);
    return data ? JSON.parse(data) : THINGS_TO_DO;
  },
  setExplore: (data: Activity[]) => localStorage.setItem(STORAGE_KEYS.EXPLORE, JSON.stringify(data)),

  login: (username: string, password: string): boolean => {
    // Requirements: Username 'admin' and Password 'glammys2025'
    if (username.toLowerCase() === 'Pam' && password === 'Pam7825') {
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      return true;
    }
    return false;
  },
  logout: () => localStorage.removeItem(STORAGE_KEYS.AUTH),
  isAuthenticated: (): boolean => localStorage.getItem(STORAGE_KEYS.AUTH) === 'true'
};
