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

// Check if we're using Neon (Replit) or standard PostgreSQL (Render)
const isNeonDatabase = process.env.DATABASE_URL.includes('neon.tech');

let pool: NeonPool | PgPool;
let db: ReturnType<typeof drizzleNeon> | ReturnType<typeof drizzlePg>;

if (isNeonDatabase) {
  // Configure for Neon serverless (Replit)
  neonConfig.webSocketConstructor = ws;
  pool = new NeonPool({ connectionString: process.env.DATABASE_URL });
  db = drizzleNeon({ client: pool, schema });
} else {
  // Configure for standard PostgreSQL (Render, etc.)
  // Parse connection string to check if SSL is specified
  const connectionString = process.env.DATABASE_URL;
  const requireSSL = connectionString.includes('sslmode=require');
  
  const poolConfig: any = {
    connectionString: connectionString
  };
  
  // Only add SSL config if in production or SSL is required
  if (process.env.NODE_ENV === 'production' || requireSSL) {
    poolConfig.ssl = {
      rejectUnauthorized: false  // Accept self-signed certificates
    };
  }
    
  pool = new PgPool(poolConfig);
  db = drizzlePg({ client: pool, schema });
}

export { pool, db };
