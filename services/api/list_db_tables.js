const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();

async function main() {
  const tables = await prisma.$queryRaw`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
  `;
  console.log('TOTAL_TABLES_IN_DB:', tables.length);
  tables.forEach(t => console.log(' - ' + t.tablename));
}

main().catch(console.error).finally(() => prisma.$disconnect());
