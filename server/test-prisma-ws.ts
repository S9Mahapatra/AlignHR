import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const connectionString = "postgres://neondb_owner:npg_koCOajr6Kw2Y@ep-round-heart-ao7jczm2.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}
main();
