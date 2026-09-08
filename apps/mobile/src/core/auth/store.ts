import { create } from 'zustand';
import Storage from '../storage';
import ApiClient from '../api/client';

interface UserInfo {
  id: string;
  email: string;
  profile?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    location?: string;
    bio?: string;
    headline?: string;
    onboardingStep?: number;
    onboardingDone?: boolean;
    avatar?: string;
    bannerColor?: string;
    bannerTextColor?: string;
    badgeText?: string;
    originCity?: any;
    originCountry?: any;
    currentCity?: any;
    currentCountry?: any;
    currentStatus?: any;
    interests?: string[];
    skills?: string[];
    passions?: string[];
    aspirations?: string;
    challenges?: string;
    education?: any[];
    experience?: any[];
    experiences?: any[];
    identityStatus?: string;
    phone?: string;
    phoneVerified?: boolean;
    dob?: string;
    aadhaarMasked?: string;
    aadhaarVerified?: boolean;
    [key: string]: any;
  };
}

interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  isProfileDrawerOpen: boolean;
  setProfileDrawerOpen: (open: boolean) => void;
  isTabBarHidden: boolean;
  setTabBarHidden: (hidden: boolean) => void;
  isProfileOpen: boolean;
  setProfileOpen: (open: boolean) => void;
  setSession: (user: UserInfo, accessToken: string, refreshToken: string) => Promise<void>;
  clearSession: () => Promise<void>;
  setGuest: (isGuest: boolean) => void;
  initialize: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (userData: Partial<UserInfo>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isGuest: false,
  isLoading: true,
  isProfileDrawerOpen: false,
  setProfileDrawerOpen: (open) => set({ isProfileDrawerOpen: open }),
  isTabBarHidden: false,
  setTabBarHidden: (hidden) => set({ isTabBarHidden: hidden }),
  isProfileOpen: false,
  setProfileOpen: (open) => set({ isProfileOpen: open }),

  setSession: async (user, accessToken, refreshToken) => {
    await Storage.setItem('accessToken', accessToken);
    await Storage.setItem('refreshToken', refreshToken);
    await Storage.setItem('userData', JSON.stringify(user));
    set({ user, isAuthenticated: true, isGuest: false, isLoading: false });
  },

  clearSession: async () => {
    await Storage.removeItem('accessToken');
    await Storage.removeItem('refreshToken');
    await Storage.removeItem('userData');
    set({ user: null, isAuthenticated: false, isGuest: false, isLoading: false });
  },

  setGuest: (isGuest) => set({ isGuest }),

  initialize: async () => {
    set({ isLoading: true });
    try {
      const accessToken = await Storage.getItem('accessToken');
      const cachedUserStr = await Storage.getItem('userData');

      let parsedUser: UserInfo | null = null;
      if (cachedUserStr) {
        try {
          parsedUser = JSON.parse(cachedUserStr);
        } catch {
          parsedUser = null;
        }
      }

      if (accessToken) {
        // 1. Immediately restore logged-in status using cached user data
        const initialUser: UserInfo = parsedUser || {
          id: 'user_cached_id',
          email: 'user@humanplatform.io',
          profile: { firstName: 'Sangamesh', lastName: 'K', onboardingDone: true }
        };
        set({ user: initialUser, isAuthenticated: true, isGuest: false });

        // 2. Refresh user profile details in background if server is online
        try {
          const response = await ApiClient.get('/auth/me', { timeout: 3000 });
          if (response.data) {
            const freshUser: UserInfo = {
              ...response.data,
              profile: {
                ...(response.data.profile || {}),
                onboardingDone: response.data.profile?.onboardingDone ?? true,
              },
            };
            await Storage.setItem('userData', JSON.stringify(freshUser));
            set({ user: freshUser, isAuthenticated: true });
          }
        } catch (apiErr: any) {
          // If server explicitly returns 401/403 Unauthorized, wipe session
          if (apiErr.response && (apiErr.response.status === 401 || apiErr.response.status === 403)) {
            await Storage.removeItem('accessToken');
            await Storage.removeItem('refreshToken');
            await Storage.removeItem('userData');
            set({ user: null, isAuthenticated: false });
          }
          // Otherwise keep user logged in with cached data
        }
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (e: any) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  refreshUser: async () => {
    try {
      const response = await ApiClient.get('/auth/me');
      set({ user: response.data });
    } catch (e) {
      console.log('Error refreshing user profile:', e);
    }
  },

  updateUser: (userData) => {
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            ...userData,
            profile: {
              ...(state.user.profile || {}),
              ...(userData.profile || {}),
            },
          }
        : null,
    }));
  },
}));

export default useAuthStore;
