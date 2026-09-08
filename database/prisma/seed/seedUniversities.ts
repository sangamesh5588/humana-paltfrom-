import { PrismaClient, MasterStatus } from '@prisma/client';

export async function seedUniversities(prisma: PrismaClient) {
  console.log('Seeding universities...');

  const india = await prisma.country.findFirst({ where: { iso2: 'IN' } });
  const usa = await prisma.country.findFirst({ where: { iso2: 'US' } });
  const uk = await prisma.country.findFirst({ where: { iso2: 'GB' } });

  const universities = [
    { name: 'Stanford University', slug: 'stanford-university', countryId: usa?.id, website: 'https://stanford.edu', ranking: 2 },
    { name: 'Massachusetts Institute of Technology (MIT)', slug: 'mit', countryId: usa?.id, website: 'https://mit.edu', ranking: 1 },
    { name: 'University of Oxford', slug: 'oxford', countryId: uk?.id, website: 'https://ox.ac.uk', ranking: 3 },
    { name: 'Indian Institute of Technology (IIT) Bombay', slug: 'iit-bombay', countryId: india?.id, website: 'https://iitb.ac.in', ranking: 149 },
    { name: 'Indian Institute of Technology (IIT) Delhi', slug: 'iit-delhi', countryId: india?.id, website: 'https://iitd.ac.in', ranking: 150 },
    { name: 'Indian Institute of Science (IISc) Bangalore', slug: 'iisc-bangalore', countryId: india?.id, website: 'https://iisc.ac.in', ranking: 200 },
  ];

  for (const uni of universities) {
    await prisma.university.upsert({
      where: { slug: uni.slug },
      update: {},
      create: {
        ...uni,
        status: MasterStatus.ACTIVE,
      },
    });
  }
  console.log(`Seeded ${universities.length} universities.`);
}
