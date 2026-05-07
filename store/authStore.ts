import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  language: 'en' | 'ar';
  setUser: (user: User, token: string) => void;
  logout: () => void;
  setLanguage: (lang: 'en' | 'ar') => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      language: 'en',
      setUser: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
