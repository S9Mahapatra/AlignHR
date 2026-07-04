const { Pool } = require('@neondatabase/serverless');
const ws = require('ws');

const connectionString = "postgres://neondb_owner:npg_koCOajr6Kw2Y@ep-round-heart-ao7jczm2.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({ connectionString });
pool.query('SELECT 1 as val').then(res => console.log(res.rows)).catch(err => console.error(err)).finally(() => pool.end());
