import { Pool, neonConfig } from '@neondatabase/serverless';
const pool = new Pool({ connectionString: "postgres://neondb_owner:npg_koCOajr6Kw2Y@ep-round-heart-ao7jczm2.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require" });
console.log(pool.options);
