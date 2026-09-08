import { PrismaClient, MasterStatus } from '@prisma/client';

export async function seedIndustries(prisma: PrismaClient) {
  console.log('Seeding industries...');
  const industries = [
    { name: 'Information Technology', slug: 'information-technology', icon: '💻' },
    { name: 'Financial Services', slug: 'financial-services', icon: '🏦' },
    { name: 'Healthcare', slug: 'healthcare', icon: '🏥' },
    { name: 'Education', slug: 'education', icon: '🎓' },
    { name: 'Real Estate', slug: 'real-estate', icon: '🏢' },
    { name: 'Manufacturing', slug: 'manufacturing', icon: '🏭' },
    { name: 'Retail', slug: 'retail', icon: '🛍️' },
  ];

  for (const ind of industries) {
    await prisma.industry.upsert({
      where: { slug: ind.slug },
      update: {},
      create: {
        ...ind,
        status: MasterStatus.ACTIVE,
      },
    });
  }
  console.log(`Seeded ${industries.length} industries.`);
}
