import { NavigatorScreenParams } from '@react-navigation/native';

// =========================================
// Auth Navigator Stack Params
// =========================================
export type AuthStackParamList = {
  Welcome: undefined;
  OnboardingSlides: undefined;
  OnboardingFlow: undefined;
  Login: undefined;
};

// =========================================
// Onboarding Navigator Stack Params
// =========================================
export type OnboardingStackParamList = {
  Step1_Origin: undefined;
  Step2_Education: undefined;
  Step3_Experience: undefined;
  Step4_CurrentLocation: undefined;
  Step5_Interests: undefined;
  Step6_Skills: undefined;
  Step7_Goals: undefined;
  Step8_Completion: undefined;
};

// =========================================
// Home Stack Params
// =========================================
export type HomeStackParamList = {
  Home: undefined;
  Search: undefined;
  ExpertProfile: { expertId: string };
  PublicExpertProfile: { expertId?: string; session?: any };
  LearnerSessionBooking: { session: any };
  LearnerBookingSuccess: { booking?: any; session?: any; meetingUrl?: string; slotDateTime?: string };
  LiveVideoCall: { booking?: any; session?: any; meetingUrl?: string };
  BookingConfirmation: { expertId: string; scheduleSlot?: string };
};

// =========================================
// Bookings Stack Params
// =========================================
export type BookingStackParamList = {
  Bookings: undefined;
  BookingDetails: { bookingId: string };
  VideoCall: { channelId: string; bookingId: string };
};

// =========================================
// Connect Tab Stack Params
// =========================================
export type ConnectStackParamList = {
  ConnectCenter: undefined;
};

// =========================================
// Inbox Stack Params
// =========================================
export type InboxStackParamList = {
  Inbox: undefined;
  Chat: { conversationId: string; recipientName: string };
  Call: { callId: string; recipientName: string };
};

// =========================================
// Goals Stack Params
// =========================================
export type GoalsStackParamList = {
  Goals: undefined;
  GoalDetails: { goalId: string };
};

// =========================================
// Profile Stack Params
// =========================================
export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Settings: undefined;
  EditExperience: { 
    experience?: any; 
    lockCompany?: boolean; 
    companyName?: string; 
    location?: string; 
  };
  EditEducation: { 
    education?: any; 
  };
};

// =========================================
// Bottom Tab Navigator Params
// =========================================
export type BottomTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  BookingsTab: NavigatorScreenParams<BookingStackParamList>;
  ConnectTab: NavigatorScreenParams<ConnectStackParamList>;
  InboxTab: NavigatorScreenParams<InboxStackParamList>;
  GoalsTab: NavigatorScreenParams<GoalsStackParamList>;
};

// =========================================
// Root Navigator Params
// =========================================
export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};

// =========================================
// App Navigator Params
// =========================================
export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
  EditExperience: {
    experience?: any;
    lockCompany?: boolean;
    companyName?: string;
    location?: string;
  };
  EditEducation: {
    education?: any;
  };
  ConsultationHours: undefined;
  ExpertStack: undefined;
  ExpertHome: undefined;
  ExpertStory: undefined;
  ExpertCatalog: undefined;
  ExpertJourney: { typeSlug?: string };
  ExpertPending: undefined;
  ExpertApproved: undefined;
  AiGuide: { initialGoal?: string } | undefined;
  AiRecommendations: { sessionId: string };
};
