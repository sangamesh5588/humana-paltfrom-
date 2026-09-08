export type ExpertVerificationStatusType = 
  | 'UNVERIFIED' 
  | 'DRAFT' 
  | 'PENDING_REVIEW' 
  | 'APPROVED' 
  | 'REJECTED';

export interface VerificationTypeItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  icon?: string;
  estimatedTime?: string;
  order?: number;
}

export interface VerificationFieldConfig {
  fieldKey: string;
  label: string;
  placeholder?: string;
  fieldType: 'text' | 'email' | 'select' | 'date' | 'file';
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
}

export type JourneyStepTypeKind = 
  | 'PROFILE_REVIEW' 
  | 'TEXT_FIELD' 
  | 'DROPDOWN' 
  | 'OTP_VERIFICATION' 
  | 'DOCUMENT_UPLOAD' 
  | 'DECLARATION' 
  | 'REVIEW';

export interface VerificationStepConfig {
  stepOrder: number;
  type: JourneyStepTypeKind;
  title: string;
  subtitle?: string;
  required?: boolean;
  fields?: VerificationFieldConfig[];
  config?: Record<string, any>;
}

export interface JourneyConfigData {
  typeSlug: string;
  title: string;
  version: number;
  steps: VerificationStepConfig[];
}

export interface ExpertStorySlide {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  bgGradient?: string[];
  benefits: string[];
  image_url?: string;
  cta_label?: string;
}

export interface ActiveSessionData {
  id: string;
  verificationTypeSlug: string;
  verificationTypeName: string;
  currentStepOrder: number;
  submittedAt?: string;
  rejectionReason?: string;
}

export interface ExpertBadgeData {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon: string;
  badgeColor?: string;
  textColor?: string;
}

export interface ExpertHomeOverviewData {
  status: ExpertVerificationStatusType;
  activeSession: ActiveSessionData | null;
  badges: ExpertBadgeData[];
  availableVerificationTypes: VerificationTypeItem[];
  storyOverview: {
    title: string;
    subtitle: string;
    actionText: string;
  };
}

export interface ExpertEarningStat {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayout: number;
  completedSessionsCount: number;
  avgRating: number;
  monthlyGrowthPercent: number;
}

export interface PayoutTransaction {
  id: string;
  clientName: string;
  topic: string;
  amount: number;
  date: string;
  status: 'COMPLETED' | 'PROCESSING' | 'PENDING';
  method: string;
}

export interface ExpertAppointment {
  id: string;
  clientName: string;
  clientAvatar?: string;
  date: string;
  timeSlot: string;
  durationMinutes: number;
  topic: string;
  price: number;
  status: 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED';
  meetingUrl?: string;
}

export interface AvailabilitySlot {
  id: string;
  dayOfWeek: string; // 'Monday', 'Tuesday', etc.
  startTime: string; // '09:00'
  endTime: string;   // '17:00'
  enabled: boolean;
}

