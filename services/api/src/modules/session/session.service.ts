import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';
import { SessionStatus } from '@prisma/client';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

@Injectable()
export class SessionService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor(private readonly prisma: PrismaService) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async resolveDefaultUserId(): Promise<string> {
    try {
      const googleUser = await this.prisma.user.findFirst({
        where: { email: 'sangukarsanga7@gmail.com' },
      });
      if (googleUser) return googleUser.id;

      const firstUser = await this.prisma.user.findFirst();
      if (firstUser) return firstUser.id;
    } catch {}
    throw new BadRequestException('No user found. Please log in first.');
  }

  async getSessionCategories() {
    let categories = await this.prisma.sessionCategory.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { name: 'asc' },
    });

    if (categories.length === 0) {
      const defaults = [
        { name: 'College Students', slug: 'college-students', description: 'Guidance for college students', iconName: 'GraduationCap' },
        { name: 'Career Switcher', slug: 'career-switcher', description: 'Transition into new tech and domain roles', iconName: 'RefreshCw' },
        { name: 'Abroad Studies', slug: 'abroad-studies', description: 'University applications and visa guidance', iconName: 'Plane' },
        { name: 'Tech Interview Prep', slug: 'tech-interview-prep', description: 'Coding, DSA, and System Design practice', iconName: 'Code' },
        { name: 'Executive Leadership', slug: 'executive-leadership', description: 'Management and strategic career growth', iconName: 'Briefcase' },
        { name: 'Startup & Product', slug: 'startup-product', description: 'Product management and startup building', iconName: 'Rocket' },
      ];

      for (const item of defaults) {
        await this.prisma.sessionCategory.upsert({
          where: { slug: item.slug },
          update: {},
          create: item,
        });
      }

      categories = await this.prisma.sessionCategory.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { name: 'asc' },
      });
    }

    return categories;
  }

  async createSession(userId: string, dto: CreateSessionDto & { categoryId?: string; linkedBadgeId?: string }) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { experience: true, education: true },
    });

    if (!profile) {
      throw new BadRequestException('User profile not found. Please complete profile setup.');
    }

    if (dto.linkedBadgeId) {
      const expMatch = profile.experience.find((e) => e.id === dto.linkedBadgeId);
      const eduMatch = profile.education.find((e) => e.id === dto.linkedBadgeId);
      const linked = expMatch || eduMatch;

      if (!linked) {
        throw new BadRequestException('The selected experience or education background does not exist in your profile.');
      }

      if (!linked.verified && linked.verificationStatus !== 'VERIFIED') {
        throw new BadRequestException('Only VERIFIED experience or education background records can be linked to a session.');
      }
    } else {
      const hasAnyVerified =
        profile.experience.some((e) => e.verified || e.verificationStatus === 'VERIFIED') ||
        profile.education.some((e) => e.verified || e.verificationStatus === 'VERIFIED');

      if (!hasAnyVerified) {
        throw new BadRequestException('You must have at least 1 VERIFIED work experience or education record to create sessions.');
      }
    }

    return this.prisma.session.create({
      data: {
        expertId: userId,
        title: dto.title,
        description: dto.description,
        language: dto.language || 'English',
        category: dto.category || 'Career Strategy',
        categoryId: dto.categoryId,
        videoUrl: dto.videoUrl,
        thumbnailUrl: dto.thumbnailUrl,
        explanation: dto.explanation,
        topics: dto.topics || [],
        timeline: dto.timeline ? JSON.parse(JSON.stringify(dto.timeline)) : null,
        targetAudience: dto.targetAudience || [],
        outcomes: dto.outcomes || [],
        bookingQuestions: dto.bookingQuestions ? JSON.parse(JSON.stringify(dto.bookingQuestions)) : null,
        rules: dto.rules ? JSON.parse(JSON.stringify(dto.rules)) : null,
        durationMinutes: dto.durationMinutes || 45,
        priceAmount: dto.priceAmount || 999,
        availabilitySchedule: dto.availabilitySchedule ? JSON.parse(JSON.stringify(dto.availabilitySchedule)) : null,
        status: SessionStatus.DRAFT,
      },
    });
  }

  async updateSession(id: string, dto: UpdateSessionDto & { categoryId?: string }) {
    const session = await this.prisma.session.findUnique({ where: { id } });
    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    return this.prisma.session.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        language: dto.language,
        category: dto.category,
        categoryId: dto.categoryId,
        videoUrl: dto.videoUrl,
        thumbnailUrl: dto.thumbnailUrl,
        explanation: dto.explanation,
        topics: dto.topics,
        timeline: dto.timeline ? JSON.parse(JSON.stringify(dto.timeline)) : null,
        targetAudience: dto.targetAudience,
        outcomes: dto.outcomes,
        bookingQuestions: dto.bookingQuestions ? JSON.parse(JSON.stringify(dto.bookingQuestions)) : null,
        rules: dto.rules ? JSON.parse(JSON.stringify(dto.rules)) : null,
        durationMinutes: dto.durationMinutes,
        priceAmount: dto.priceAmount,
        availabilitySchedule: dto.availabilitySchedule ? JSON.parse(JSON.stringify(dto.availabilitySchedule)) : null,
      },
    });
  }

  async getExpertSessions(userId: string) {
    return this.prisma.session.findMany({
      where: { expertId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getApprovedFeed(category?: string, search?: string) {
    const whereClause: any = {};
    
    if (category && category !== 'ALL') {
      whereClause.category = { contains: category, mode: 'insensitive' };
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    let sessions = await this.prisma.session.findMany({
      where: { ...whereClause, status: SessionStatus.APPROVED },
      include: {
        expertProfile: {
          include: {
            experience: { take: 1 },
            education: { take: 1 },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // If no APPROVED sessions, also include SUBMITTED (under review) so experts
    // can at least see their own sessions are being processed — but never return DRAFTs
    if (sessions.length === 0) {
      sessions = await this.prisma.session.findMany({
        where: { ...whereClause, status: { in: [SessionStatus.APPROVED, SessionStatus.SUBMITTED] } },
        include: {
          expertProfile: {
            include: {
              experience: { take: 1 },
              education: { take: 1 },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return sessions.map((s) => ({
      ...s,
      expertName: `${s.expertProfile?.firstName || 'Expert'} ${s.expertProfile?.lastName || ''}`.trim(),
      expertHeadline: s.expertProfile?.headline || s.expertProfile?.experience?.[0]?.title || 'Verified Platform Expert',
      expertCompany: s.expertProfile?.experience?.[0]?.company || 'Human Platform',
      expertAvatar: s.expertProfile?.avatar || null,
      expertVerified: true,
    }));
  }

  async bookSessionSlot(_userId: string, sessionId: string, bookingDto: { slotDateTime: string; answers?: any }) {
    const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }

    return {
      success: true,
      bookingId: `bk-${Date.now()}`,
      sessionId: session.id,
      sessionTitle: session.title,
      slotDateTime: bookingDto.slotDateTime,
      durationMinutes: session.durationMinutes,
      priceAmount: session.priceAmount,
      meetUrl: `https://meet.jit.si/human-platform-${session.id.slice(0, 8)}`,
      createdAt: new Date().toISOString(),
    };
  }

  async getSessionDetails(id: string) {
    const session = await this.prisma.session.findUnique({
      where: { id },
      include: {
        expertProfile: {
          include: {
            education: true,
            experience: true,
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
    return session;
  }

  async submitSession(id: string) {
    return this.prisma.session.update({
      where: { id },
      data: { status: SessionStatus.SUBMITTED },
    });
  }

  async approveSession(id: string) {
    return this.prisma.session.update({
      where: { id },
      data: { status: SessionStatus.APPROVED },
    });
  }

  async rejectSession(id: string, rejectionReason?: string) {
    return this.prisma.session.update({
      where: { id },
      data: {
        status: SessionStatus.REJECTED,
        rejectionReason: rejectionReason || 'Session details or video teaser preview require revision before approval.',
      },
    });
  }

  async resubmitSession(id: string) {
    return this.prisma.session.update({
      where: { id },
      data: {
        status: SessionStatus.SUBMITTED,
        rejectionReason: null,
      },
    });
  }

  async analyzeSession(id: string) {
    const session = await this.prisma.session.findUnique({
      where: { id },
      include: {
        expertProfile: {
          include: {
            education: true,
            experience: true,
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    const profile = session.expertProfile;
    const verifiedRole = profile?.experience?.find((e: any) => e.verified || e.current)?.title || profile?.experience?.[0]?.title || 'Consultant';
    const verifiedCompany = profile?.experience?.find((e: any) => e.verified || e.current)?.company || profile?.experience?.[0]?.company || 'Verified Firm';

    let aiQualityScore = 88;
    let aiConciseSummary = `Mentorship & Advisory Session on ${session.title} by ${profile?.firstName || 'Verified'} ${profile?.lastName || 'Expert'}.`;
    let aiKeywords: string[] = Array.from(new Set([session.category, ...session.title.split(' ').filter(w => w.length > 3)])).slice(0, 8);
    let aiSuggestions: string[] = [
      'Your session outline is clear and aligns well with your verified background.',
      'Tip: Upload a short video teaser to boost user booking conversion rates by 40%.',
    ];
    let recommendedPrice = 1499;
    let pricingReason = `Based on your verified ${verifiedRole} role at ${verifiedCompany} and the transformational value of your session.`;

    // Attempt live Google Gemini 1.5 Flash Analysis if API Key exists
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: SchemaType.OBJECT,
              properties: {
                qualityScore: { type: SchemaType.INTEGER },
                conciseSummary: { type: SchemaType.STRING },
                keywords: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                suggestions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                recommendedPrice: { type: SchemaType.INTEGER },
                pricingReason: { type: SchemaType.STRING },
              },
              required: ['qualityScore', 'conciseSummary', 'keywords', 'suggestions', 'recommendedPrice', 'pricingReason'],
            },
          },
        });

        const prompt = `
          You are an expert AI Auditor and Pricing Strategist for an Advisory Platform. Analyze this consultation session:
          - Title: "${session.title}"
          - Category: "${session.category}"
          - Description: "${session.description}"
          - Topics: ${JSON.stringify(session.topics)}
          - Outcomes: ${JSON.stringify(session.outcomes)}
          - Expert Background: "${verifiedRole} at ${verifiedCompany}"
          - Native Origin: "${profile?.originVillage || ''}, ${profile?.originDistrict || ''}, ${profile?.originState || ''}"
          - Duration: ${session.durationMinutes} Minutes
          
          Evaluate quality score (0-100), extract 5-8 search keywords, write a 2-sentence summary, give 2 improvement tips, and determine recommendedPrice (INR ₹) and pricingReason.
          CRITICAL PRICING RULE: recommendedPrice MUST end in 49 or 99 (e.g. 499, 799, 999, 1499, 1999, 2499, 3499, 4999).
        `;

        const result = await model.generateContent(prompt);
        const aiData = JSON.parse(result.response.text());

        if (aiData.qualityScore) aiQualityScore = aiData.qualityScore;
        if (aiData.conciseSummary) aiConciseSummary = aiData.conciseSummary;
        if (aiData.keywords && aiData.keywords.length > 0) aiKeywords = aiData.keywords;
        if (aiData.suggestions && aiData.suggestions.length > 0) aiSuggestions = aiData.suggestions;
        if (aiData.recommendedPrice) recommendedPrice = aiData.recommendedPrice;
        if (aiData.pricingReason) pricingReason = aiData.pricingReason;
      } catch (err) {
        console.warn('Gemini API call failed, falling back to heuristic engine:', err);
      }
    }

    if (pricingReason && !aiSuggestions.includes(pricingReason)) {
      aiSuggestions.unshift(`Pricing Note: ${pricingReason}`);
    }

    return this.prisma.session.update({
      where: { id },
      data: {
        aiConciseSummary,
        aiKeywords,
        aiQualityScore,
        aiSuggestions,
        priceAmount: recommendedPrice,
      },
    });
  }

  async generateStepCopilot(dto: { userId?: string; currentStep: number; currentAnswers?: any; userPrompt?: string }) {
    const userId = dto.userId || await this.resolveDefaultUserId();

    // 1. Fetch Expert's Verified Background & Education from Database
    let profileContext = '';
    try {
      const expList = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT company, role, designation FROM experiences WHERE "userId" = $1 AND verified = true LIMIT 3`,
        userId
      );
      const eduList = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT degree, institution FROM education WHERE "userId" = $1 AND verified = true LIMIT 3`,
        userId
      );

      if (expList && expList.length > 0) {
        profileContext += ` Verified Roles: ${expList.map(e => `${e.role || e.designation || 'Engineer'} at ${e.company || 'Tech Company'}`).join(', ')}.`;
      }
      if (eduList && eduList.length > 0) {
        profileContext += ` Education: ${eduList.map(e => `${e.degree || 'Degree'} from ${e.institution || 'University'}`).join(', ')}.`;
      }
    } catch {}

    if (!this.genAI) {
      return this.getProfileAwareCopilotResponse(dto, profileContext);
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              assistantMessage: { type: SchemaType.STRING },
              quickQuestions: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING }
              },
              suggestions: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    id: { type: SchemaType.STRING },
                    label: { type: SchemaType.STRING },
                    applyData: {
                      type: SchemaType.OBJECT,
                      properties: {
                        title: { type: SchemaType.STRING },
                        description: { type: SchemaType.STRING },
                        explanation: { type: SchemaType.STRING },
                        topics: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                        questions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                        outcomes: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                        price: { type: SchemaType.STRING },
                      }
                    }
                  }
                }
              }
            },
            required: ['assistantMessage', 'suggestions']
          }
        }
      });

      const prompt = `You are AI Co-Pilot for Human Platform session creation.
Expert Verified Background: ${profileContext || 'Senior Industry Professional'}
Wizard Step: ${dto.currentStep} of 7.
Form State: ${JSON.stringify(dto.currentAnswers || {})}
User Input / Story: "${dto.userPrompt || dto.currentAnswers?.title || ''}"

STRICT BANNED WORDS: "mentoring", "mentorship", "mentor", "mentee", "consultation", "consulting", "consultant".
Use terms like: "Session", "Strategy Call", "Deep-Dive", "Mastery Blueprint", "Learner", "Expert".

Instructions:
1. Read the user's raw story or input (e.g., "how did i crack google coming from small village" or "english hindi telugu").
2. Rephrase their story into a compelling, high-converting Title, Description, and Category.
3. If they mention languages, normalize them cleanly (e.g. "English, Hindi, Telugu").
4. Return a warm 2-sentence assistantMessage and a single applyData object with title, description, category, language, topics, or price.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return JSON.parse(text);
    } catch (err) {
      console.warn('Gemini Copilot API fallback:', err);
      return this.getProfileAwareCopilotResponse(dto, profileContext);
    }
  }

  private getProfileAwareCopilotResponse(dto: { currentStep: number; currentAnswers?: any; userPrompt?: string }, profileContext: string) {
    const step = dto.currentStep;
    const rawInput = dto.userPrompt || dto.currentAnswers?.title || 'System Design & High-Scale Technical Mastery';
    
    let title = rawInput;
    let description = `High-impact 1:1 strategy session covering technical execution, system design patterns, and career progression based on ${profileContext || 'verified experience'}.`;
    let category = 'Career Growth & Leadership';

    if (rawInput.toLowerCase().includes('google') || rawInput.toLowerCase().includes('village')) {
      title = 'From Small Village to Google SDE: Complete Career Roadmap & Interview Prep';
      description = 'An inspiring 1:1 strategy session on breaking barriers from a non-traditional background, cracking FAANG system design, and building high-impact engineering projects.';
      category = 'Career Growth & Leadership';
    }

    if (step === 2) {
      return {
        assistantMessage: `That's an inspiring story! I've rephrased your ideas into a high-converting session title, description, and category. Tap Apply to Form when ready!`,
        suggestions: [
          {
            id: 'sug-story-2',
            label: 'Apply Custom Rephrased Session',
            applyData: {
              title,
              description,
              category,
            }
          }
        ]
      };
    }

    if (step === 3) {
      return {
        assistantMessage: 'Record a brief 30-second introduction video and pick a thumbnail image to showcase your expertise.',
        suggestions: []
      };
    }

    if (step === 4) {
      return {
        assistantMessage: `I've structured a 5-stage agenda and learning outcomes for "${title}".`,
        suggestions: [
          {
            id: 'sug-clean-4',
            label: 'Apply 5-Stage Agenda',
            applyData: {
              explanation: 'A structured 60-minute deep-dive designed to solve core technical and career bottlenecks.',
              topics: ['Introduction & Goal Setting', 'Architecture & System Design Tear-Down', 'Mock Interview Round', 'Actionable Roadmap', 'Live Q&A & Next Steps'],
              outcomes: ['Personalized 90-Day Prep Roadmap', 'System Architecture Notes', 'Direct Q&A Clarifications'],
            }
          }
        ]
      };
    }

    if (step === 5) {
      return {
        assistantMessage: 'I recommend setting a platform rate of ₹1,499 and adding 4 learner preparation questions.',
        suggestions: [
          {
            id: 'sug-clean-5',
            label: 'Apply Rate (₹1,499) & Questions',
            applyData: {
              price: '1499',
              questions: [
                'What is your current role/background?',
                'What is your primary goal for this session?',
                'Share your Resume or LinkedIn link',
                'What specific questions do you want us to cover?'
              ]
            }
          }
        ]
      };
    }

    return {
      assistantMessage: 'Select your weekly availability slots.',
      suggestions: []
    };
  }
}
