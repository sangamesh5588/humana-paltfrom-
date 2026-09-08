import { create } from 'zustand';
import { ExpertHomeOverviewData, ExpertStorySlide, VerificationTypeItem } from '../types/expert.types';
import { ExpertApi } from '../api/expert.api';

interface ExpertState {
  overview: ExpertHomeOverviewData | null;
  slides: ExpertStorySlide[];
  types: VerificationTypeItem[];
  isLoading: boolean;
  error: string | null;
  activeMode: 'user' | 'expert';

  fetchHomeOverview: () => Promise<void>;
  fetchStorySlides: () => Promise<void>;
  fetchVerificationTypes: () => Promise<void>;
  setActiveMode: (mode: 'user' | 'expert') => void;
}

const defaultStorySlides: ExpertStorySlide[] = [
  {
    id: 'slide-1',
    title: 'Share Your Expertise',
    subtitle: 'Connect 1:1 with ambitious professionals seeking guidance in tech, career, and leadership.',
    icon: 'briefcase',
    benefits: [],
    image_url: '',
    cta_label: 'Next',
  },
  {
    id: 'slide-2',
    title: 'Flexible Schedule & Bookings',
    subtitle: 'Set your custom open consultation hours and manage video calls on your own terms.',
    icon: 'calendar',
    benefits: [],
    image_url: '',
    cta_label: 'Next',
  },
  {
    id: 'slide-3',
    title: 'Build Reputation & Earn',
    subtitle: 'Monetize your wisdom, gain official verified status, and scale your advisory brand.',
    icon: 'award',
    benefits: [],
    image_url: '',
    cta_label: 'Get Started',
  },
];

export const useExpertStore = create<ExpertState>((set) => ({
  overview: null,
  slides: defaultStorySlides,
  types: [],
  isLoading: false,
  error: null,
  activeMode: 'expert',

  fetchHomeOverview: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ExpertApi.getHomeOverview();
      set({ overview: data, isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to fetch overview', isLoading: false });
    }
  },

  fetchStorySlides: async () => {
    try {
      const data = await ExpertApi.getStorySlides();
      if (data && data.slides && data.slides.length > 0) {
        set({ slides: data.slides });
      }
    } catch (e: any) {
      console.warn('Error fetching story slides:', e);
    }
  },

  fetchVerificationTypes: async () => {
    try {
      const types = await ExpertApi.getVerificationTypes();
      set({ types });
    } catch (e: any) {
      console.warn('Error fetching verification types:', e);
    }
  },

  setActiveMode: (mode) => set({ activeMode: mode }),
}));

export default useExpertStore;

