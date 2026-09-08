import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiResponse } from './interfaces/ai-state.interface';
import axios from 'axios';

@Injectable()
export class AiGuideService {
  private genAI: GoogleGenerativeAI;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey || '');
  }

  /**
   * Initializes or fetches an active AI session for the user.
   */
  async getOrCreateSession(userId: string, initialGoal?: string) {
    // Look for a session in COLLECTING_INFO status
    let session = await this.prisma.aiSession.findFirst({
      where: {
        userId,
        status: 'COLLECTING_INFO',
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    if (!session) {
      const userProfile = await this.prisma.profile.findFirst({
        where: { userId },
      });

      const firstName = userProfile?.firstName ? ` ${userProfile.firstName}` : '';
      const rootsText = userProfile?.originDistrict || userProfile?.originVillage || userProfile?.originState;
      const rootsSuffix = rootsText ? ` (background: ${rootsText})` : '';

      session = await this.prisma.aiSession.create({
        data: {
          userId,
          goal: initialGoal || null,
          status: 'COLLECTING_INFO',
          structuredData: initialGoal ? { goal: initialGoal } : {},
        },
      });

      // Save initial welcome message
      await this.prisma.aiMessage.create({
        data: {
          sessionId: session.id,
          sender: 'SYSTEM',
          content: initialGoal 
            ? `Hello${firstName}! I will help you find the right verified people for: "${initialGoal}". Let's start—what stage is this goal currently in?`
            : `Hello${firstName}! I am your Humana Guide. I know your background${rootsSuffix} and connect you with verified people who share your roots. What is your goal today?`,
        },
      });
    }

    return this.prisma.aiSession.findUnique({
      where: { id: session.id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  /**
   * Processes a new user message, updates conversation state, and calls Gemini.
   */
  async processMessage(userId: string, sessionId: string, userMessage: string) {
    const [session, userProfile] = await Promise.all([
      this.prisma.aiSession.findFirst({
        where: { id: sessionId, userId },
        include: {
          messages: { orderBy: { createdAt: 'asc' } },
        },
      }),
      this.prisma.profile.findFirst({
        where: { userId },
        include: {
          education: true,
          experience: true,
        },
      }),
    ]);

    if (!session) {
      throw new NotFoundException('AI Session not found');
    }

    // 1. Save user's message
    await this.prisma.aiMessage.create({
      data: {
        sessionId,
        sender: 'USER',
        content: userMessage,
      },
    });

    // 2. Build conversational history context for Gemini
    const chatHistory = session.messages.map((m: any) => ({
      role: m.sender === 'USER' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    // Add user's latest message to history for prompt
    chatHistory.push({
      role: 'user',
      parts: [{ text: userMessage }],
    });

    const userContext = userProfile ? `
      USER PROFILE BACKGROUND DATA (You ALREADY know this about the user! Do NOT ask them for these unless clarifying):
      - Name: ${userProfile.firstName || ''} ${userProfile.lastName || ''}
      - Headline: ${userProfile.headline || 'Not specified'}
      - Native Village: ${userProfile.originVillage || 'Not specified'}
      - Native District: ${userProfile.originDistrict || 'Not specified'}
      - Native State: ${userProfile.originState || 'Not specified'}
      - Spoken Languages: ${userProfile.languages?.join(', ') || 'Not specified'}
      - College/University: ${userProfile.education?.map((e: any) => e.institution || e.school).filter(Boolean).join(', ') || 'Not specified'}
      - Work Experience: ${userProfile.experience?.map((exp: any) => `${exp.role || exp.title} at ${exp.company}`).filter(Boolean).join(', ') || 'Not specified'}
    ` : '';

    // 3. System Instructions
    const systemInstruction = `
      You are the Humana AI Guide, an elite personal consultant. Your role is to understand the user's goal and match them with verified people who share their roots and experience.

      ${userContext}

      CRITICAL CONVERSATIONAL RULES:
      1. Address the user warmly by their first name if available.
      2. YOU ALREADY KNOW THEIR BACKGROUND AND ROOTS FROM THEIR PROFILE ABOVE. Never ask them for their native village, district, state, or college if it is already in their profile!
      3. Automatically include their known birthDistrict, originVillage, college, and language into "extractedParameters"!
      4. Keep all responses brief (under 2-3 short sentences). Never dump advice or long paragraphs.
      5. Ask ONLY ONE intelligent question at a time to clarify what specific goal or problem they want to solve today.
      6. Once you understand their goal and stage, summarize it and set "isReadyToRecommend" to true.
      7. Output strictly in valid JSON format:
         {
           "reply": "Your warm 1-2 sentence response",
           "extractedParameters": {
             "goal": "inferred overall goal",
             "stage": "stage of goal/project",
             "industry": "industry name",
             "region": "target region",
             "birthDistrict": "district name from profile or conversation",
             "college": "college from profile or conversation",
             "language": "languages"
           },
           "isReadyToRecommend": true/false
         }
    `;

    let aiResponse: GeminiResponse;

    const openRouterKey = this.configService.get<string>('OPENROUTER_API_KEY');

    if (openRouterKey && openRouterKey.trim().length > 0) {
      try {
        const messages = [
          { role: 'system', content: systemInstruction },
          ...chatHistory.map((h: any) => ({
            role: h.role === 'model' ? 'assistant' : 'user',
            content: h.parts[0].text,
          })),
        ];

        const modelName = this.configService.get<string>('OPENROUTER_MODEL') || 'google/gemini-2.0-flash-lite-preview-02-05:free';

        const res = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: modelName,
            messages,
          },
          {
            headers: {
              Authorization: `Bearer ${openRouterKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://humana.app',
              'X-Title': 'Humana AI Guide',
            },
          },
        );

        let content = res.data?.choices?.[0]?.message?.content || '{}';
        // Strip markdown code fences if present (e.g. ```json ... ```)
        content = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
        aiResponse = JSON.parse(content) as GeminiResponse;
      } catch (err: any) {
        console.error('[AI Guide] OpenRouter API call failed:', err?.response?.data || err?.message);
        aiResponse = {
          reply: "I understand. Could you tell me a little more about your target region or background so I can find the best match?",
          extractedParameters: {},
          isReadyToRecommend: false,
        };
      }
    } else {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-2.0-flash',
          generationConfig: {
            responseMimeType: 'application/json',
          },
          systemInstruction,
        });

        const chat = model.startChat({
          history: chatHistory,
        });

        const response = await chat.sendMessage(userMessage);
        const text = response.response.text();
        aiResponse = JSON.parse(text) as GeminiResponse;
      } catch (err) {
        console.error('[AI Guide] Gemini API call failed:', err);
        aiResponse = {
          reply: "I understand. Could you tell me a little more about your target region or background so I can find the best match?",
          extractedParameters: {},
          isReadyToRecommend: false,
        };
      }
    }

    // 4. Save AI reply message
    await this.prisma.aiMessage.create({
      data: {
        sessionId,
        sender: 'SYSTEM',
        content: aiResponse.reply,
      },
    });

    // 5. Merge and update structured parameters in DB
    const currentData = (session.structuredData as any) || {};
    const mergedData = {
      ...currentData,
      ...(aiResponse.extractedParameters || {}),
    };

    const statusUpdate = aiResponse.isReadyToRecommend ? 'RECOMMENDING' : 'COLLECTING_INFO';

    await this.prisma.aiSession.update({
      where: { id: sessionId },
      data: {
        status: statusUpdate,
        goal: mergedData.goal || session.goal,
        structuredData: mergedData,
      },
    });

    return {
      reply: aiResponse.reply,
      isReadyToRecommend: aiResponse.isReadyToRecommend,
      structuredData: mergedData,
    };
  }

  /**
   * Fetches previous AI sessions for a user.
   */
  async getSessions(userId: string) {
    return this.prisma.aiSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 2, // Take initial welcome exchange
        },
      },
    });
  }
}
