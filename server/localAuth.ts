import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
import { storage } from "./storage";

// Validate required environment variables
if (!process.env.SESSION_SECRET) {
  throw new Error("Environment variable SESSION_SECRET not provided");
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // CSRF protection
      maxAge: sessionTtl,
    },
  });
}

// Hash password with Argon2
export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64 MB
    timeCost: 3,
    parallelism: 1,
  });
}

// Verify password with Argon2
export async function verifyPassword(hashedPassword: string, plainPassword: string): Promise<boolean> {
  try {
    return await argon2.verify(hashedPassword, plainPassword);
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}

// Generate secure verification token
export function generateVerificationToken(): string {
  return uuidv4();
}

// Hash verification token for secure storage
export async function hashVerificationToken(token: string): Promise<string> {
  return await argon2.hash(token, {
    type: argon2.argon2id,
    memoryCost: 2 ** 14, // 16 MB (lighter for tokens)
    timeCost: 2,
    parallelism: 1,
  });
}

// Verify token against hash
export async function verifyToken(hashedToken: string, plainToken: string): Promise<boolean> {
  try {
    return await argon2.verify(hashedToken, plainToken);
  } catch (error) {
    console.error("Token verification error:", error);
    return false;
  }
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure Local strategy for email/password authentication
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          // Get user by email
          const user = await storage.getUserByEmail(email);
          if (!user) {
            return done(null, false, { message: "Invalid email or password" });
          }

          // Check if user has a password (not an OAuth user)
          if (!user.passwordHash) {
            return done(null, false, { message: "Please set up your password first" });
          }


          // Verify password
          const isValidPassword = await verifyPassword(user.passwordHash, password);
          if (!isValidPassword) {
            return done(null, false, { message: "Invalid email or password" });
          }

          // Update last login
          await storage.updateUserLastLogin(user.id);

          return done(null, user);
        } catch (error) {
          console.error("Authentication error:", error);
          return done(error, false);
        }
      }
    )
  );

  // Serialize user for session storage
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        // User not found, clear the session
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      console.error("Session deserialization error:", error);
      done(null, false);
    }
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  next();
};