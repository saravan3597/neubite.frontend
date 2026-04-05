import { create } from 'zustand';
import type { User } from '../services/AuthService';
import { AuthService } from '../services/AuthService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (username, password) => {
    try {
      set({ isLoading: true });
      const { user, token } = await AuthService.login(username, password);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await AuthService.logout();
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkSession: async () => {
    try {
      set({ isLoading: true });
      const token = await AuthService.getSession();
      if (token) {
        // Here we ideally fetch user info from token payload or API
        set({ token, isAuthenticated: true, isLoading: false, user: { id: 'mock', email: 'mock@example.com', username: 'mock_user' } });
      } else {
        set({ isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      set({ isAuthenticated: false, isLoading: false });
    }
  }
}));
