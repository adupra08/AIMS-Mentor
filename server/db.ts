import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Check if we're using Neon (Replit) or standard PostgreSQL (Render)
const isNeonDatabase = process.env.DATABASE_URL.includes('neon.tech');

if (isNeonDatabase) {
  // Configure for Neon serverless (Replit)
  neonConfig.webSocketConstructor = ws;
} else {
  // Configure for standard PostgreSQL (Render, etc.)
  neonConfig.webSocketConstructor = undefined as any;
}

// Create connection pool with SSL for production non-Neon databases
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: !isNeonDatabase && process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false
});

export const db = drizzle({ client: pool, schema });