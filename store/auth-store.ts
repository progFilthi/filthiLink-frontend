import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  email: string | null;
  isAuthenticated: boolean;
  setAuth: (accessToken: string, refreshToken: string, email: string) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
  initialize: () => void;
  getRefreshToken: () => string | null;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  email: null,
  isAuthenticated: false,

  setAuth: (accessToken, refreshToken, email) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('email', email);
    }
    set({ accessToken, email, isAuthenticated: true });
  },

  setAccessToken: (accessToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
    }
    set({ accessToken });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
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

  getRefreshToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }
}));
