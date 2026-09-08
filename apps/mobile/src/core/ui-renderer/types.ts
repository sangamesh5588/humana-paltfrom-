export interface SDUIOption {
  label: string;
  value: string;
}

export interface SDUIValidation {
  pattern?: string; // RegEx validation pattern
  min?: number;     // Min length or value
  max?: number;     // Max length or value
  message?: string; // Custom error message
}

export interface SDUIField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'dropdown' | 'date' | 'picker' | 'upload';
  isRequired: boolean;
  validationRule?: SDUIValidation | null;
  options?: SDUIOption[] | null;
  order: number;
}

export interface SDUIForm {
  id: string;
  name: string;
  description?: string | null;
  fields: SDUIField[];
}

export interface SDUIStep {
  id: string;
  code: string;
  name: string;
  order: number;
  form?: SDUIForm | null;
}

export interface UserStepProgressInfo {
  id: string;
  stepId: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  formData?: Record<string, any> | null;
  step: SDUIStep;
}

export interface UserJourneySession {
  id: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  currentStepId?: string | null;
  progressPercentage: number;
  template: {
    id: string;
    code: string;
    name: string;
    description?: string | null;
    steps: SDUIStep[];
  };
  stepProgress: UserStepProgressInfo[];
}
