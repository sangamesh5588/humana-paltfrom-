import { PrismaClient, MasterStatus } from '@prisma/client';

export async function seedSkills(prisma: PrismaClient) {
  console.log('Seeding skills...');
  const skills = [
    { name: 'TypeScript', slug: 'typescript', category: 'Programming Languages' },
    { name: 'JavaScript', slug: 'javascript', category: 'Programming Languages' },
    { name: 'React Native', slug: 'react-native', category: 'Mobile Development' },
    { name: 'React', slug: 'react', category: 'Frontend Development' },
    { name: 'NestJS', slug: 'nestjs', category: 'Backend Development' },
    { name: 'Node.js', slug: 'nodejs', category: 'Backend Development' },
    { name: 'Prisma ORM', slug: 'prisma-orm', category: 'Backend Development' },
    { name: 'PostgreSQL', slug: 'postgresql', category: 'Databases' },
    { name: 'Docker', slug: 'docker', category: 'DevOps' },
    { name: 'UI/UX Design', slug: 'ui-ux-design', category: 'Design' },
    { name: 'Product Management', slug: 'product-management', category: 'Product' },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { slug: skill.slug },
      update: {},
      create: {
        ...skill,
        status: MasterStatus.ACTIVE,
      },
    });
  }
  console.log(`Seeded ${skills.length} skills.`);
}
