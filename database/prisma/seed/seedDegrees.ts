import { PrismaClient, MasterStatus, DegreeLevel } from '@prisma/client';

export async function seedDegrees(prisma: PrismaClient) {
  console.log('Seeding degrees...');
  const degrees = [
    { name: 'Lower Kindergarten (LKG)', slug: 'lkg', level: DegreeLevel.LKG },
    { name: 'Primary School (Class 1-5)', slug: 'primary', level: DegreeLevel.PRIMARY },
    { name: 'Middle School (Class 6-8)', slug: 'middle', level: DegreeLevel.MIDDLE },
    { name: 'High School (Class 10)', slug: 'high-school', level: DegreeLevel.HIGH_SCHOOL },
    { name: 'Senior Secondary (Class 12)', slug: 'senior-secondary', level: DegreeLevel.SENIOR_SECONDARY },
    { name: 'Diploma', slug: 'diploma', level: DegreeLevel.DIPLOMA },
    { name: 'Bachelor of Science (B.Sc)', slug: 'bachelor-of-science', level: DegreeLevel.BACHELORS },
    { name: 'Bachelor of Engineering (B.E) / Technology (B.Tech)', slug: 'btech', level: DegreeLevel.BACHELORS },
    { name: 'Master of Science (M.Sc)', slug: 'master-of-science', level: DegreeLevel.MASTERS },
    { name: 'Master of Technology (M.Tech)', slug: 'mtech', level: DegreeLevel.MASTERS },
    { name: 'Doctor of Philosophy (Ph.D)', slug: 'phd', level: DegreeLevel.DOCTORATE },
    { name: 'Post-Doctorate', slug: 'post-doc', level: DegreeLevel.POST_DOCTORATE },
    { name: 'Professional Certificate', slug: 'certificate', level: DegreeLevel.CERTIFICATE },
    { name: 'Self-Taught / Alternative Path', slug: 'self-taught', level: DegreeLevel.SELF_TAUGHT },
  ];

  for (const deg of degrees) {
    await prisma.degree.upsert({
      where: { slug: deg.slug },
      update: {},
      create: {
        ...deg,
        status: MasterStatus.ACTIVE,
      },
    });
  }
  console.log(`Seeded ${degrees.length} degrees.`);
}
