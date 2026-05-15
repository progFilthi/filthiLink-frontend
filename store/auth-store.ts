import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  email: string | null;
  isAuthenticated: boolean;
  setAuth: (accessToken: string, email: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  email: null,
  isAuthenticated: false,
  setAuth: (accessToken, email) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('email', email);
    }
    set({ accessToken, email, isAuthenticated: true });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('email');
    }
    set({ accessToken: null, email: null, isAuthenticated: false });
  },
  initialize: () => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      const email = localStorage.getItem('email');
      if (accessToken) {
        set({ accessToken, email, isAuthenticated: true });
      }
    }
  },
}));
