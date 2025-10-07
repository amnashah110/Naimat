import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT || 5432,
  ssl: { rejectUnauthorized: false }, // Azure requires SSL
});

async function testConnection() {
  try {
    await client.connect();
    console.log('Connected successfully to Azure PostgreSQL!');
    const res = await client.query('SELECT NOW()');
    console.log('Server time:', res.rows[0].now);
  } catch (err) {
    console.error('Connection failed:', err.message);
  } finally {
    await client.end();
  }
}

testConnection();
