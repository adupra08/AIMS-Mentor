import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import { Pool as PgPool } from 'pg';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import ws from "ws";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Check if we're using Neon serverless or standard PostgreSQL
const isNeonDatabase = process.env.DATABASE_URL.includes('neon.tech');

let pool: NeonPool | PgPool;
let db: ReturnType<typeof drizzleNeon> | ReturnType<typeof drizzlePg>;

if (isNeonDatabase) {
  // Configure for Neon serverless database
  neonConfig.webSocketConstructor = ws;
  pool = new NeonPool({ connectionString: process.env.DATABASE_URL });
  db = drizzleNeon({ client: pool, schema });
} else {
  // Configure for standard PostgreSQL
  const connectionString = process.env.DATABASE_URL;
  
  // Remove any sslmode parameters from the connection string
  // We'll handle SSL configuration separately
  const cleanConnectionString = connectionString.replace(/[?&]sslmode=[^&]*/g, '');
  
  const poolConfig: any = {
    connectionString: cleanConnectionString
  };
  
  // Always use SSL in production with self-signed certificate support
  if (process.env.NODE_ENV === 'production') {
    poolConfig.ssl = {
      rejectUnauthorized: false,
      require: true
    };
  }
    
  pool = new PgPool(poolConfig);
  db = drizzlePg({ client: pool, schema });
}

export { pool, db };
