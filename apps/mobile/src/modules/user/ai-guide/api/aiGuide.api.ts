import ApiClient from '../../../../core/api/client';

export interface AiMessage {
  id: string;
  sessionId: string;
  sender: 'USER' | 'SYSTEM';
  content: string;
  createdAt: string;
}

export interface AiSession {
  id: string;
  userId: string;
  goal?: string;
  status: 'COLLECTING_INFO' | 'RECOMMENDING' | 'COMPLETE';
  structuredData?: any;
  messages?: AiMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface RecommendedExpert {
  userId: string;
  firstName: string;
  lastName: string;
  avatar: string;
  headline: string;
  birthVillage?: string;
  birthDistrict?: string;
  birthState?: string;
  languages: string[];
  matchedAspects: string[];
  matchReason: string;
  session?: {
    id: string;
    title: string;
    priceAmount: number;
    durationMinutes: number;
  } | null;
}

export const AiGuideApi = {
  startSession: async (initialGoal?: string): Promise<AiSession> => {
    const res = await ApiClient.post('/ai/sessions', { initialGoal });
    return res.data;
  },

  sendMessage: async (
    sessionId: string,
    message: string,
  ): Promise<{ reply: string; isReadyToRecommend: boolean; structuredData: any }> => {
    const res = await ApiClient.post(`/ai/sessions/${sessionId}/messages`, { message });
    return res.data;
  },

  getRecommendations: async (sessionId: string): Promise<RecommendedExpert[]> => {
    const res = await ApiClient.get(`/ai/sessions/${sessionId}/recommendations`);
    return res.data || [];
  },

  getSessions: async (): Promise<AiSession[]> => {
    const res = await ApiClient.get('/ai/sessions');
    return res.data || [];
  },

  getSession: async (id: string): Promise<AiSession> => {
    const res = await ApiClient.get(`/ai/sessions/${id}`);
    return res.data;
  },
};
