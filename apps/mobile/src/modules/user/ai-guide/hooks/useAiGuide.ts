import { useState, useCallback } from 'react';
import { AiGuideApi, AiMessage, RecommendedExpert } from '../api/aiGuide.api';

export const useAiGuide = () => {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [typing, setTyping] = useState<boolean>(false);
  const [structuredData, setStructuredData] = useState<any>({});
  const [isReadyToRecommend, setIsReadyToRecommend] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<RecommendedExpert[]>([]);

  const startOrResumeSession = useCallback(async (initialGoal?: string) => {
    setLoading(true);
    try {
      const session = await AiGuideApi.startSession(initialGoal);
      setSessionId(session.id);
      setMessages(session.messages || []);
      setStructuredData(session.structuredData || {});
      
      if (session.status === 'RECOMMENDING') {
        setIsReadyToRecommend(true);
        const matches = await AiGuideApi.getRecommendations(session.id);
        setRecommendations(matches);
      } else {
        setIsReadyToRecommend(false);
        setRecommendations([]);
      }
    } catch (err) {
      console.error('Failed to initialize AI session:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendUserMessage = useCallback(async (text: string) => {
    if (!sessionId) return;

    // 1. Instantly append user message locally for responsiveness
    const userMsgPlaceholder: AiMessage = {
      id: Math.random().toString(),
      sessionId,
      sender: 'USER',
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsgPlaceholder]);
    
    setTyping(true);
    try {
      const response = await AiGuideApi.sendMessage(sessionId, text);

      // 2. Append AI response
      const aiMsg: AiMessage = {
        id: Math.random().toString(),
        sessionId,
        sender: 'SYSTEM',
        content: response.reply,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setStructuredData(response.structuredData);
      
      // 3. Handle transition to recommendations page if flagged
      if (response.isReadyToRecommend) {
        setIsReadyToRecommend(true);
        // Load recommendations
        const matches = await AiGuideApi.getRecommendations(sessionId);
        setRecommendations(matches);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      // Append fallback AI message
      const errorMsg: AiMessage = {
        id: Math.random().toString(),
        sessionId,
        sender: 'SYSTEM',
        content: "I'm having trouble connecting to the guide service. Let me try again.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setTyping(false);
    }
  }, [sessionId]);

  const resetSession = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    setStructuredData({});
    setIsReadyToRecommend(false);
    setRecommendations([]);
  }, []);

  return {
    messages,
    sessionId,
    loading,
    typing,
    structuredData,
    isReadyToRecommend,
    recommendations,
    startOrResumeSession,
    sendUserMessage,
    resetSession,
  };
};
