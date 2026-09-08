import { create } from 'zustand';
import { JourneyConfigData } from '../../../shared/types/expert.types';
import { ExpertApi } from '../../../shared/api/expert.api';

interface JourneyState {
  sessionId: string | null;
  typeSlug: string | null;
  journeyConfig: JourneyConfigData | null;
  currentStepIndex: number;
  answers: Record<string, any>;
  documents: any[];
  isSubmitting: boolean;
  declarationAccepted: boolean;

  initJourney: (typeSlug: string, experienceId?: string, educationId?: string) => Promise<any>;
  setCurrentStepIndex: (index: number) => void;
  updateAnswer: (key: string, value: any) => void;
  addDocument: (doc: any) => void;
  removeDocument: (index: number) => void;
  setDeclarationAccepted: (accepted: boolean) => void;
  nextStep: () => Promise<boolean>;
  prevStep: () => void;
  submitJourney: () => Promise<boolean>;
  resetJourney: () => void;
}

export const useJourneyStore = create<JourneyState>((set, get) => ({
  sessionId: null,
  typeSlug: null,
  journeyConfig: null,
  currentStepIndex: 0,
  answers: {},
  documents: [],
  isSubmitting: false,
  declarationAccepted: false,

  initJourney: async (typeSlug: string, experienceId?: string, educationId?: string) => {
    set({ isSubmitting: true, typeSlug, currentStepIndex: 0, answers: {}, documents: [] });
    try {
      const res = await ExpertApi.startSession(typeSlug, experienceId, educationId);
      set({
        sessionId: res.session?.id || `session-${Date.now()}`,
        journeyConfig: res.journeyConfig,
        answers: res.session?.answers || {},
        documents: res.session?.documents || [],
        isSubmitting: false,
      });
      return res.session;
    } catch (e) {
      console.warn('Error starting session, loading offline config:', e);
      const fallbackConfig = await ExpertApi.getJourneyConfig(typeSlug);
      set({
        sessionId: `session-local-${Date.now()}`,
        journeyConfig: fallbackConfig,
        isSubmitting: false,
      });
      return null;
    }
  },

  setCurrentStepIndex: (index: number) => set({ currentStepIndex: index }),

  updateAnswer: (key: string, value: any) => {
    set((state) => ({
      answers: { ...state.answers, [key]: value },
    }));
  },

  addDocument: (doc: any) => {
    set((state) => ({
      documents: [...state.documents, doc],
    }));
  },

  removeDocument: (index: number) => {
    set((state) => ({
      documents: state.documents.filter((_, i) => i !== index),
    }));
  },

  setDeclarationAccepted: (accepted: boolean) => set({ declarationAccepted: accepted }),

  nextStep: async () => {
    const { sessionId, currentStepIndex, journeyConfig, answers, documents } = get();
    if (!journeyConfig) return false;

    const totalSteps = journeyConfig.steps.length;
    const nextIdx = currentStepIndex + 1;

    if (sessionId) {
      try {
        const cleanDocs = (documents || []).map((d: any) => ({
          id: d.id || 'doc',
          name: d.name || 'document.jpg',
          url: (d.url || d.fileUrl || '').startsWith('data:') ? 'binary_hidden' : (d.url || d.fileUrl || ''),
          mime: d.mime || 'image/jpeg',
        }));
        await ExpertApi.saveStep(sessionId, currentStepIndex + 1, answers, cleanDocs);
      } catch (e) {
        console.warn('Draft save error:', e);
      }
    }

    if (nextIdx < totalSteps) {
      set({ currentStepIndex: nextIdx });
      return true;
    }
    return false;
  },

  prevStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1 });
    }
  },

  submitJourney: async () => {
    const { sessionId, declarationAccepted, currentStepIndex, answers, documents } = get();
    if (!sessionId) return false;

    set({ isSubmitting: true });
    try {
      let docUrl = documents && documents.length > 0 ? (documents[0].url || documents[0].fileUrl || documents[0].uri) : undefined;
      
      // If docUrl is local file path (file:// or content://), upload it FIRST to get public Supabase URL!
      if (docUrl && (docUrl.startsWith('file:') || docUrl.startsWith('content:') || docUrl.startsWith('/'))) {
        try {
          const uploaded = await ExpertApi.uploadDocument(docUrl, documents[0].name, documents[0].mime);
          if (uploaded?.url || uploaded?.fileUrl) {
            docUrl = uploaded.url || uploaded.fileUrl;
          }
        } catch {}
      }

      const cleanDocs = (documents || []).map((d: any) => ({
        id: d.id || 'doc',
        name: d.name || 'document.jpg',
        url: docUrl && !docUrl.startsWith('data:') ? docUrl : 'uploaded_proof.jpg',
        fileUrl: docUrl && !docUrl.startsWith('data:') ? docUrl : 'uploaded_proof.jpg',
        mime: d.mime || 'image/jpeg',
      }));

      await ExpertApi.saveStep(sessionId, currentStepIndex + 1, answers, cleanDocs);
      await ExpertApi.submitSession(sessionId, declarationAccepted, answers.experienceId, answers.educationId, docUrl);
      set({ isSubmitting: false });
      return true;
    } catch (e: any) {
      console.warn('Error submitting journey:', e?.response?.data || e.message || e);
      set({ isSubmitting: false });
      return false;
    }
  },

  resetJourney: () => {
    set({
      sessionId: null,
      typeSlug: null,
      journeyConfig: null,
      currentStepIndex: 0,
      answers: {},
      documents: [],
      isSubmitting: false,
      declarationAccepted: false,
    });
  },
}));

export default useJourneyStore;
