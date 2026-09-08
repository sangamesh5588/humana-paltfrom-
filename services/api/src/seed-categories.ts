import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding session_categories table...');

  const categories = [
    { name: 'College Students', slug: 'college-students', description: 'Guidance for college students and academics', iconName: 'GraduationCap' },
    { name: 'Career Switcher', slug: 'career-switcher', description: 'Transition into new tech and domain roles', iconName: 'RefreshCw' },
    { name: 'Abroad Studies', slug: 'abroad-studies', description: 'University applications and visa guidance', iconName: 'Plane' },
    { name: 'Tech Interview Prep', slug: 'tech-interview-prep', description: 'Coding, DSA, and System Design practice', iconName: 'Code' },
    { name: 'Executive Leadership', slug: 'executive-leadership', description: 'Management and strategic career growth', iconName: 'Briefcase' },
    { name: 'Startup & Product', slug: 'startup-product', description: 'Product management and startup building', iconName: 'Rocket' },
  ];

  for (const item of categories) {
    const res = await prisma.sessionCategory.upsert({
      where: { slug: item.slug },
      update: { name: item.name, description: item.description, iconName: item.iconName },
      create: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        iconName: item.iconName,
        status: 'ACTIVE',
      },
    });
    console.log(`Seeded category: ${res.name} (${res.id})`);
  }

  console.log('Categories successfully seeded into Supabase PostgreSQL!');
  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  prisma.$disconnect();
  process.exit(1);
});
