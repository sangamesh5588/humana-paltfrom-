import { create } from 'zustand';

export interface EducationItem {
  id?: string;
  school: string;
  degree: string;
  degreeLevel: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  verified?: boolean;
  officialEmail?: string;
  emailVerified?: boolean;
  documentUrl?: string;
  verificationStatus?: string;
}

export interface ExperienceItem {
  id?: string;
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  verified?: boolean;
  officialEmail?: string;
  emailVerified?: boolean;
  documentUrl?: string;
  verificationStatus?: string;
}

interface OnboardingStore {
  // Origin
  originCountryId: string;
  originCountryName: string;
  originState: string;
  originDistrict: string;
  originCity: string;
  originVillage: string;
  grewUpInVillage: boolean;

  // Education
  educationList: EducationItem[];
  noEducation: boolean;

  // Experience
  experienceList: ExperienceItem[];
  noExperience: boolean;

  // Current status & location
  currentCountryId: string;
  currentCountryName: string;
  currentState: string;
  currentCity: string;
  currentStatus: string; // 'WORKING' | 'STUDYING' | 'LOOKING' | 'OTHER'

  // Interests / Ambitions
  interests: string[];
  skills: string[];
  passions: string[];
  aspirations: string;
  challenges: string;

  // Action methods
  setField: (field: string, value: any) => void;
  setFields: (fields: Partial<OnboardingStore>) => void;
  reset: () => void;
}

export const useOnboardingState = create<OnboardingStore>((set) => ({
  originCountryId: '',
  originCountryName: '',
  originState: '',
  originDistrict: '',
  originCity: '',
  originVillage: '',
  grewUpInVillage: false,

  educationList: [],
  noEducation: false,

  experienceList: [],
  noExperience: false,

  currentCountryId: '',
  currentCountryName: '',
  currentState: '',
  currentCity: '',
  currentStatus: '',

  interests: [],
  skills: [],
  passions: [],
  aspirations: '',
  challenges: '',

  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  setFields: (fields) => set((state) => ({ ...state, ...fields })),
  reset: () =>
    set({
      originCountryId: '',
      originCountryName: '',
      originState: '',
      originDistrict: '',
      originCity: '',
      originVillage: '',
      grewUpInVillage: false,
      educationList: [],
      noEducation: false,
      experienceList: [],
      noExperience: false,
      currentCountryId: '',
      currentCountryName: '',
      currentState: '',
      currentCity: '',
      currentStatus: '',
      interests: [],
      skills: [],
      passions: [],
      aspirations: '',
      challenges: '',
    }),
}));

export default useOnboardingState;
