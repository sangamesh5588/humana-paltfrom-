import { PrismaClient, MasterStatus } from '@prisma/client';

export async function seedExpertVerification(prisma: PrismaClient) {
  console.log('--- SEEDING 3 PRIMARY SECTOR VERIFICATION CATEGORIES & BADGES ---');

  const categories = [
    {
      id: 'vt-career',
      slug: 'career',
      title: 'Corporate Career & Experience',
      subtitle: 'Verify work experience at tech companies, MNCs, or fast-growing startups',
      icon: 'briefcase',
      estimatedTime: '3 mins',
      order: 1,
      status: MasterStatus.ACTIVE,
    },
    {
      id: 'vt-education',
      slug: 'education',
      title: 'Higher Education & Alumni',
      subtitle: 'Verify degree, student status, or academic rank at accredited universities',
      icon: 'graduation-cap',
      estimatedTime: '2 mins',
      order: 2,
      status: MasterStatus.ACTIVE,
    },
    {
      id: 'vt-skills',
      slug: 'skills',
      title: 'Specialized Skills & Advisory',
      subtitle: 'Verify domain expertise in Design, Product, Growth, Engineering, or Consulting',
      icon: 'zap',
      estimatedTime: '3 mins',
      order: 3,
      status: MasterStatus.ACTIVE,
    },
  ];

  for (const cat of categories) {
    try {
      await prisma.verificationType.upsert({
        where: { slug: cat.slug },
        update: cat,
        create: cat,
      });
      console.log(` ✅ VerificationType seeded: ${cat.slug}`);
    } catch (e: any) {
      console.error(` ❌ Error seeding VerificationType [${cat.slug}]:`, e.message);
    }
  }

  const badges = [
    {
      id: 'badge-career',
      slug: 'corporate-expert',
      name: 'Corporate Expert',
      description: 'Verified work experience at an accredited tech company or corporation.',
      icon: 'briefcase',
      badgeColor: '#ECFDF5',
      textColor: '#047857',
    },
    {
      id: 'badge-education',
      slug: 'verified-scholar',
      name: 'Verified Scholar',
      description: 'Verified degree or alumni status at an accredited university.',
      icon: 'graduation-cap',
      badgeColor: '#EEF2FF',
      textColor: '#4F46E5',
    },
    {
      id: 'badge-skills',
      slug: 'specialized-advisor',
      name: 'Specialized Advisor',
      description: 'Verified domain expertise in specialized technical or business disciplines.',
      icon: 'zap',
      badgeColor: '#FEF3C7',
      textColor: '#D97706',
    },
  ];

  for (const badge of badges) {
    try {
      await prisma.expertBadge.upsert({
        where: { slug: badge.slug },
        update: badge,
        create: badge,
      });
      console.log(` ✅ ExpertBadge seeded: ${badge.slug}`);
    } catch (e: any) {
      console.error(` ❌ Error seeding ExpertBadge [${badge.slug}]:`, e.message);
    }
  }

  console.log('--- SEEDING COMPLETE ---');
}
