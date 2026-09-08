import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ExtractedParameters } from './interfaces/ai-state.interface';

@Injectable()
export class ExpertMatchService {
  private genAI: GoogleGenerativeAI;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey || '');
  }

  /**
   * Matches a user with experts based on multi-dimensional roots (birthplace, language, college, company, goal).
   */
  async findMatches(userId: string, filters: ExtractedParameters): Promise<any[]> {
    // 1. Fetch user's own profile to find overlapping roots
    const userProfile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        education: true,
        experience: true,
      },
    });

    if (!userProfile) {
      return [];
    }

    // 2. Fetch all verified experts and their sessions/education/experience
    // Filtering out the user themselves
    const experts = await this.prisma.profile.findMany({
      where: {
        userId: { not: userId },
        user: {
          expertProfile: {
            status: { in: ['APPROVED', 'VERIFIED'] },
          },
        },
      },
      include: {
        education: true,
        experience: true,
        sessions: {
          where: {
            status: 'APPROVED',
          },
        },
      },
    });

    if (experts.length === 0) {
      return [];
    }

    // 3. Score each expert
    const scoredExperts = experts.map((expert) => {
      let score = 0;
      const matchedAspects: string[] = [];

      // A. Goal & Industry Alignment (Max 40 points)
      let goalMatchCount = 0;
      const goalKeywords = [
        ...(filters.goal ? filters.goal.toLowerCase().split(/\s+/) : []),
        ...(filters.industry ? filters.industry.toLowerCase().split(/\s+/) : []),
        ...(filters.stage ? filters.stage.toLowerCase().split(/\s+/) : []),
      ].filter(k => k.length > 3);

      const expertText = [
        expert.headline,
        expert.bio,
        ...expert.experience.map(e => `${e.title} ${e.company} ${e.description || ''}`),
        ...expert.sessions.map(s => `${s.title} ${s.description} ${s.topics.join(' ')}`),
      ].join(' ').toLowerCase();

      goalKeywords.forEach((word) => {
        if (expertText.includes(word)) {
          goalMatchCount++;
        }
      });

      if (goalKeywords.length > 0) {
        const ratio = goalMatchCount / goalKeywords.length;
        score += Math.min(Math.round(ratio * 40), 40);
      }

      // B. Geographic Roots & Language Alignment (Max 30 points)
      let rootsScore = 0;
      const targetRegion = filters.region?.toLowerCase();
      if (targetRegion && expert.languages.some(l => l.toLowerCase() === targetRegion)) {
        rootsScore += 5;
      }
      
      // Match with User's Birthplace Details
      if (userProfile.originVillage && expert.originVillage && userProfile.originVillage.toLowerCase() === expert.originVillage.toLowerCase()) {
        rootsScore += 25;
        matchedAspects.push('Same Birth Village');
      } else if (userProfile.originDistrict && expert.originDistrict && userProfile.originDistrict.toLowerCase() === expert.originDistrict.toLowerCase()) {
        rootsScore += 20;
        matchedAspects.push('Same Birth District');
      } else if (userProfile.originState && expert.originState && userProfile.originState.toLowerCase() === expert.originState.toLowerCase()) {
        rootsScore += 10;
        matchedAspects.push('Same Native State');
      }

      // Match spoken languages
      const sharedLanguages = userProfile.languages.filter((lang) =>
        expert.languages.some((el) => el.toLowerCase() === lang.toLowerCase()),
      );
      if (sharedLanguages.length > 0) {
        rootsScore += 5;
        matchedAspects.push(`Shared Language (${sharedLanguages[0]})`);
      }

      score += Math.min(rootsScore, 30);

      // C. Educational Pedigree Alignment (Max 15 points)
      let eduScore = 0;
      const sharedSchools = userProfile.education.filter((ue) =>
        expert.education.some(
          (ee) =>
            ee.school.toLowerCase().includes(ue.school.toLowerCase()) ||
            ue.school.toLowerCase().includes(ee.school.toLowerCase()),
        ),
      );
      if (sharedSchools.length > 0) {
        eduScore += 15;
        matchedAspects.push(`Shared School (${sharedSchools[0].school})`);
      }
      score += eduScore;

      // D. Company Pedigree & Career Transition Alignment (Max 15 points)
      let expScore = 0;
      const sharedCompanies = userProfile.experience.filter((ux) =>
        expert.experience.some(
          (ex) =>
            ex.company.toLowerCase().includes(ux.company.toLowerCase()) ||
            ux.company.toLowerCase().includes(ex.company.toLowerCase()),
        ),
      );
      if (sharedCompanies.length > 0) {
        expScore += 10;
        matchedAspects.push(`Shared Employer (${sharedCompanies[0].company})`);
      }
      
      // Simple situational transition logic (e.g. if both have worked in multiple roles)
      if (userProfile.experience.length > 1 && expert.experience.length > 2) {
        expScore += 5;
      }
      score += expScore;

      return {
        expert,
        score,
        matchedAspects,
      };
    });

    // 4. Sort and pick top 3 matches
    const topMatches = scoredExperts
      .filter((item) => item.score > 5) // Minimum score threshold
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    // 5. Generate custom LLM match descriptions
    const result = [];
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    for (const match of topMatches) {
      const exp = match.expert;
      
      const userOrigin = `${userProfile.originVillage || ''} ${userProfile.originDistrict || ''} ${userProfile.originState || ''}`.trim();
      const userSchools = userProfile.education.map(e => e.school).join(', ');
      const userCompanies = userProfile.experience.map(e => e.company).join(', ');
      
      const expOrigin = `${exp.originVillage || ''} ${exp.originDistrict || ''} ${exp.originState || ''}`.trim();
      const expSchools = exp.education.map(e => e.school).join(', ');
      const expCompanies = exp.experience.map(e => e.company).join(', ');

      const prompt = `
        You are the matching system of Humana. You are connecting a user with a verified expert.
        Write a highly personalized, short (2 sentences max) explanation of why this expert is a perfect match.
        Focus on shared roots (hometown, district, college, past employer, native language) and situational goals.
        Write in first person (e.g. "I recommend Rahul because..."). Make it encouraging and consultant-like.

        User Profile:
        - Hometown/Roots: ${userOrigin || 'Not Specified'}
        - Colleges/Schools: ${userSchools || 'Not Specified'}
        - Companies Worked: ${userCompanies || 'Not Specified'}
        - Spoken Languages: ${userProfile.languages.join(', ') || 'English'}
        - User Goal: ${filters.goal || 'Professional connection'}

        Expert Profile:
        - Name: ${exp.firstName || ''} ${exp.lastName || ''}
        - Headline: ${exp.headline || ''}
        - Hometown/Roots: ${expOrigin || 'Not Specified'}
        - Colleges/Schools: ${expSchools || 'Not Specified'}
        - Companies Worked: ${expCompanies || 'Not Specified'}
        - Spoken Languages: ${exp.languages.join(', ') || 'English'}
        - Headline: ${exp.headline || ''}
        - Core Sessions Available: ${exp.sessions.map(s => s.title).join('; ') || '1:1 Live Consultation'}

        Explanation:
      `;

      let matchReason = '';
      try {
        const response = await model.generateContent(prompt);
        matchReason = response.response.text().trim();
      } catch (err) {
        matchReason = `Recommended due to high background alignment in your target industry and shared professional roots.`;
      }

      // Add details to result list
      result.push({
        userId: exp.userId,
        firstName: exp.firstName,
        lastName: exp.lastName,
        avatar: exp.avatar,
        headline: exp.headline,
        birthVillage: exp.originVillage,
        birthDistrict: exp.originDistrict,
        birthState: exp.originState,
        languages: exp.languages,
        matchedAspects: match.matchedAspects,
        matchReason,
        // Use the first approved session to book
        session: exp.sessions.length > 0 ? {
          id: exp.sessions[0].id,
          title: exp.sessions[0].title,
          priceAmount: exp.sessions[0].priceAmount,
          durationMinutes: exp.sessions[0].durationMinutes,
        } : null,
      });
    }

    return result;
  }
}
