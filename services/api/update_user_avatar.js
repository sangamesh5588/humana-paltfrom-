require('dotenv').config({ path: '../../.env' });
const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();

async function main() {
  const targetEmail = 'sangukarsanga7@gmail.com';
  const avatarUrl = 'https://xfgdxcekwizpqwzzctit.supabase.co/storage/v1/object/public/profile/a6cb664a-df9d-46b4-8112-dc5e453bfde3.webp';

  const user = await prisma.user.findUnique({
    where: { email: targetEmail },
    include: { profile: true },
  });

  if (!user) {
    console.error(`User ${targetEmail} not found!`);
    process.exit(1);
  }

  const updatedProfile = await prisma.profile.update({
    where: { userId: user.id },
    data: { avatar: avatarUrl },
  });

  console.log(`Successfully updated profile avatar for ${targetEmail} (${user.id}):`);
  console.log(`New avatar URL: ${updatedProfile.avatar}`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Failed to update avatar:', err);
  prisma.$disconnect();
});
