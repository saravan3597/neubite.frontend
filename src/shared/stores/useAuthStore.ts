import { create } from 'zustand';
import { handleSignIn, handleSignOut, fetchUserAttributes, getUserSession } from '../../features/auth/services/authService';

interface User {
  email?: string;
  name?: string;
  username?: string;
  [key: string]: string | undefined;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    try {
      set({ isLoading: true });
      const { success, isSignedIn } = await handleSignIn(email, password);

      if (success && isSignedIn) {
        const [userDetails, session] = await Promise.all([fetchUserAttributes(), getUserSession()]);
        const token = session?.tokens?.idToken?.toString() ?? null;
        set({ isAuthenticated: true, isLoading: false, user: userDetails, token });
      } else {
        set({ isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await handleSignOut();
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkSession: async () => {
    try {
      set({ isLoading: true });
      const session = await getUserSession();
      if (session) {
        const [userDetails] = await Promise.all([fetchUserAttributes()]);
        const token = session.tokens?.idToken?.toString() ?? null;
        set({ isAuthenticated: true, isLoading: false, user: userDetails, token });
      } else {
        set({ isAuthenticated: false, isLoading: false, user: null, token: null });
      }
    } catch {
      set({ isAuthenticated: false, isLoading: false, user: null, token: null });
    }
  }
}));
