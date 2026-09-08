
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) { }

  async getSummary(userId: string) {
    // 1. Get profile stats
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { education: true, experience: true },
    });

    let completionPercentage = 0;
    if (profile) {
      if (profile.firstName) completionPercentage += 15;
      if (profile.lastName) completionPercentage += 15;
      if (profile.location) completionPercentage += 20;
      if (profile.bio) completionPercentage += 20;
      if (profile.education.length > 0) completionPercentage += 15;
      if (profile.experience.length > 0) completionPercentage += 15;
    }

    // 2. Fetch active journeys (Cleaned up / Journey removed)

    // 3. Recommended Experts (Mocked details tailored to career acceleration)
    const recommendedExperts = [
      {
        id: 'exp-1',
        name: 'Sarah Connor',
        title: 'Lead Career Consultant at TechVantage',
        avatarUrl: '',
        expertise: ['Tech Resumes', 'Mock Interviews', 'Salary Negotiations'],
      },
      {
        id: 'exp-2',
        name: 'Dr. Alan Grant',
        title: 'Executive Talent Recruiter',
        avatarUrl: '',
        expertise: ['LinkedIn Branding', 'Career Transitioning'],
      },
    ];

    // 4. Mocked recent activity logs
    const recentActivity = [
      {
        id: 'act-1',
        description: 'Account profile initialized successfully.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
    ];

    return {
      profileCompletion: completionPercentage,
      activeJourneys: [],
      recommendedExperts,
      recentActivity,
    };
  }
}
