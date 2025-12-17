// stores/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import mmkvStorage from './mmkvStorage';
import { IUser } from 'types';

interface AuthState {
  user: IUser | null;
  token: string | null;
  guestToken: string | null;
  fcmToken: string | null;
  refreshToken: string | null;
  tokenType: string | null;
  isAuthenticated: boolean;
  loginPhone: string | null;
  loginData: any;
  transId: string | null;
  authData: string | null;
  setAuthData: (authData: string) => void;
  setUser: (user: IUser | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setLoginPhone: (loginPhone: string) => void;
  setLoginData: (loginData: string) => void;
  setTransId: (transId: string | null) => void;
  setToken: (token: string, tokenType: string) => void;
  setGuestToken: (token: string, tokenType: string) => void;
  setFcmToken: (fcmToken: string) => void;
  setRefreshToken: (refreshToken: string, tokenType: string) => void;
  login: (token: string, refreshToken: string, tokenType: string) => void;
  logout: () => void;
  isNotificationEnabled: boolean;
  setIsNotificationEnabled: (isNotificationEnabled: boolean) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      guestToken: null,
      fcmToken: null,
      refreshToken: null,
      isAuthenticated: false,
      tokenType: null,
      loginPhone: null,
      loginData: null,
      transId: null,
      authData: null,
      setAuthData: (authData) => set({ authData }),
      setUser: (user) => set({ user }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setToken: (token, tokenType) => set({ token, tokenType }),
      setGuestToken: (guestToken, tokenType) => set({ guestToken, tokenType }),
      setFcmToken: (fcmToken) => set({ fcmToken }),
      setRefreshToken: (refreshToken, tokenType) => set({ refreshToken, tokenType }),
      setLoginPhone: (loginPhone: string) => set({ loginPhone }),
      setLoginData: (loginData: string) => set({ loginData }),
      setTransId: (transId: string | null) => set({ transId }),
      login: (token, refreshToken, tokenType) => set({ token, refreshToken, tokenType, isAuthenticated: true }),
      logout: () => set({ authData: null, user: null, token: null, refreshToken: null, tokenType: null, isAuthenticated: false }),
      isNotificationEnabled: true,
      setIsNotificationEnabled: (isNotificationEnabled) => set({ isNotificationEnabled }),
    }),
    {
      name: 'auth-store', // Storage key
      storage: createJSONStorage(() => mmkvStorage), // Use MMKV for storage
    }
  )
);

export default useAuthStore;
