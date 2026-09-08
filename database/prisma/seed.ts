import { PrismaClient } from '@prisma/client';
import { seedCountries } from './seed/seedCountries';
import { seedIndustries } from './seed/seedIndustries';
import { seedCompanies } from './seed/seedCompanies';
import { seedJobTitles } from './seed/seedJobTitles';
import { seedSkills } from './seed/seedSkills';
import { seedDegrees } from './seed/seedDegrees';
import { seedUniversities } from './seed/seedUniversities';
import { seedExpertVerification } from './seed/seedExpertVerification';

const prisma = new PrismaClient();

async function main() {
  console.log('--- STARTING MASTER DATA SEEDING ---');

  // 1. Countries (independent)
  await seedCountries(prisma);

  // 2. Industries (independent)
  await seedIndustries(prisma);

  // 3. Degrees (independent)
  await seedDegrees(prisma);

  // 4. Job Titles (independent)
  await seedJobTitles(prisma);

  // 5. Skills (independent)
  await seedSkills(prisma);

  // 6. Companies (depends on Countries and Industries)
  await seedCompanies(prisma);

  // 7. Universities (depends on Countries)
  await seedUniversities(prisma);

  // 8. Expert Verification Categories
  await seedExpertVerification(prisma);

  console.log('--- MASTER DATA SEEDING COMPLETE ---');
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
