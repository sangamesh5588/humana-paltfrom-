import * as path from 'path';
import * as dotenv from 'dotenv';

// Load root .env or local .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient, SessionStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('Linking session 7abe092e-d2ac-4f97-9079-49aa3b123592 to Sangamesh K profile in database...');

  // 1. Resolve or create exact User
  const expertEmail = 'sangukarsanga7@gmail.com';
  let user = await prisma.user.findFirst({
    where: { OR: [{ email: expertEmail }, { id: 'a6cb664a-df9d-46b4-8112-dc5e453bfde3' }] },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: 'a6cb664a-df9d-46b4-8112-dc5e453bfde3',
        email: expertEmail,
      },
    });
  }

  const expertId = user.id;

  // 2. Ensure Profile exists and is updated for Sangamesh K
  const profile = await prisma.profile.upsert({
    where: { userId: expertId },
    update: {
      firstName: 'Sangamesh',
      lastName: 'K',
      headline: 'Senior Staff Engineer @ Google',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      bio: 'Ex-Google Senior Staff Engineer with 10+ years scaling global distributed systems, mentoring 500+ developers, and cracking top tier tech interviews.',
    },
    create: {
      userId: expertId,
      firstName: 'Sangamesh',
      lastName: 'K',
      headline: 'Senior Staff Engineer @ Google',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      bio: 'Ex-Google Senior Staff Engineer with 10+ years scaling global distributed systems, mentoring 500+ developers, and cracking top tier tech interviews.',
    },
  });

  // 3. Ensure Verified Work Experience exists on Profile
  await prisma.experience.deleteMany({ where: { profileId: profile.id } });
  await prisma.experience.create({
    data: {
      profileId: profile.id,
      company: 'Google',
      title: 'Senior Staff Software Engineer',
      location: 'Bengaluru, India',
      startDate: new Date('2020-01-01T00:00:00Z'),
      current: true,
      verified: true,
      verificationStatus: 'VERIFIED',
      description: 'Architecting high-scale distributed backend microservices and leading core cloud infrastructure teams.',
    },
  });

  const sessionId = '7abe092e-d2ac-4f97-9079-49aa3b123592';

  const sessionData = {
    expertId,
    title: 'How I Joined Google: 1:1 Tech & Career Strategy',
    description: 'Get direct 1-on-1 guidance on cracking Tier-1 tech interviews, mastering system design, resume positioning, and navigating senior engineering promotions at top product companies.',
    language: 'English & Hindi',
    category: 'Tech & Coding',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    explanation: 'A comprehensive 60-minute 1-on-1 video call designed to give you an unfair advantage in cracking top tech roles. We will tear down your system design approach, optimize your resume for recruiter ATS screens, and map out a step-by-step career acceleration plan.',
    topics: [
      'System Design & High-Scalability Architecture',
      'FAANG Coding & Algorithm Interview Strategy',
      'Resume ATS Optimization & Referral Positioning',
      'Navigating Promotions & Senior Staff Career Growth'
    ],
    targetAudience: [
      'Software Engineers aiming for Tier-1 Tech / FAANG',
      'Computer Science Students & Recent Graduates',
      'Tech Leads transitioning to Senior Staff level',
      'Engineers coming from non-traditional or small village backgrounds'
    ],
    outcomes: [
      'Personalized 90-Day Tech & Career Acceleration Action Plan',
      'Direct Feedback on System Design & Coding Interview Strategy',
      'ATS-Optimized Resume & LinkedIn Profile Blueprint',
      '1:1 Guidance on FAANG Compensation & Career Progression'
    ],
    bookingQuestions: [
      'What is your current role and years of experience?',
      'What is your primary goal for this 1:1 session?',
      'Share your LinkedIn profile or Resume link',
      'What specific system design or career questions do you want us to focus on?'
    ],
    rules: [
      'Be on time for your scheduled 1:1 video call slot',
      'Prepare your specific questions in advance for maximum value',
      'Ensure stable internet connection during the live HD video session'
    ],
    durationMinutes: 60,
    priceAmount: 1999,
    status: SessionStatus.APPROVED,
  };

  // 4. Upsert Session 7abe092e-d2ac-4f97-9079-49aa3b123592
  await prisma.session.upsert({
    where: { id: sessionId },
    update: sessionData,
    create: {
      id: sessionId,
      ...sessionData,
    },
  });

  // Link all existing sessions to expertId
  await prisma.session.updateMany({
    data: {
      expertId,
      status: SessionStatus.APPROVED,
    },
  });

  console.log('Successfully linked session 7abe092e-d2ac-4f97-9079-49aa3b123592 to Sangamesh K (expertId:', expertId, ')!');
  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error('Error seeding session data:', err);
  process.exit(1);
});
