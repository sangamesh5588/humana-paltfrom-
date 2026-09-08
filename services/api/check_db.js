require('dotenv').config({ path: '../../.env' });
const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== USERS IN DATABASE ===');
  const users = await prisma.user.findMany({
    include: {
      profile: {
        include: {
          experience: true,
          education: true,
        }
      },
    }
  });

  console.log(`Total users found: ${users.length}`);
  for (const u of users) {
    console.log(`\nUser ID: ${u.id}`);
    console.log(`  Email: ${u.email}`);
    console.log(`  GoogleID: ${u.googleId}`);
    if (u.profile) {
      console.log(`  Profile ID: ${u.profile.id}`);
      console.log(`  Avatar URL: ${u.profile.avatar}`);
      console.log(`  First Name: ${u.profile.firstName}, Last Name: ${u.profile.lastName}`);
      console.log(`  Onboarding Done: ${u.profile.onboardingDone}`);
      console.log(`  Experiences (${u.profile.experience.length}):`);
      for (const e of u.profile.experience) {
        console.log(`    - [${e.id}] ${e.title} at ${e.company} (verified: ${e.verified}, status: ${e.verificationStatus})`);
      }
      console.log(`  Education (${u.profile.education.length}):`);
      for (const ed of u.profile.education) {
        console.log(`    - [${ed.id}] ${ed.degree} at ${ed.school} (verified: ${ed.verified}, status: ${ed.verificationStatus})`);
      }
    } else {
      console.log(`  NO PROFILE RECORD!`);
    }
  }

  console.log('\n=== SESSIONS IN DATABASE ===');
  const sessions = await prisma.session.findMany();
  console.log(`Total sessions found: ${sessions.length}`);
  for (const s of sessions) {
    console.log(`\nSession ID: ${s.id}`);
    console.log(`  Title: ${s.title}`);
    console.log(`  ExpertId: ${s.expertId}`);
    console.log(`  Category: ${s.category}`);
    console.log(`  Status: ${s.status}`);
    console.log(`  Price: ${s.priceAmount}`);
    console.log(`  Created At: ${s.createdAt}`);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Error running script:', err);
  prisma.$disconnect();
});
