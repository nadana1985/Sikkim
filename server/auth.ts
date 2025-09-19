import { type Express } from 'express';
import session from 'express-session';
import ConnectPgSimple from 'connect-pg-simple';
import { pool } from './db';
import { storage } from './storage';

const PgSession = ConnectPgSimple(session);

export async function setupAuth(app: Express) {
  // Require session secret in production
  if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is required');
  }

  // Trust proxy for secure cookies behind reverse proxy
  app.set('trust proxy', 1);

  // Session configuration with PostgreSQL store
  app.use(
    session({
      store: new PgSession({
        pool: pool,
        tableName: 'sessions', 
        createTableIfMissing: false, // Table already exists from schema
      }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax', // CSRF protection
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
    })
  );

  // Development-only admin login (NEVER in production)
  if (process.env.NODE_ENV === 'development') {
    app.get('/api/dev-login', async (req, res) => {
      console.warn('DEV-ONLY: Creating test admin user');
      const testUser = {
        id: 'dev-admin-id',
        email: 'dev-admin@monastery360.com',
        firstName: 'Dev',
        lastName: 'Admin',
        isAdmin: true,
        profileImageUrl: null,
      };
      
      const user = await storage.upsertUser(testUser);
      
      // Regenerate session on login to prevent fixation
      req.session.regenerate((err) => {
        if (err) {
          console.error('Session regeneration error:', err);
          return res.status(500).json({ error: 'Session error' });
        }
        (req.session as any).userId = user.id;
        res.redirect('/');
      });
    });
  }

  // TODO: Implement proper Replit Auth with OIDC
  app.get('/api/login', (req, res) => {
    if (process.env.NODE_ENV === 'development') {
      return res.redirect('/api/dev-login');
    }
    // In production, redirect to proper Replit auth
    res.status(501).json({ 
      error: 'Replit Auth integration not yet implemented. Contact admin to configure authentication.' 
    });
  });

  app.get('/api/logout', (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
          return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
      });
    } else {
      res.redirect('/');
    }
  });

  app.get('/api/auth/user', async (req, res) => {
    const userId = (req.session as any)?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    try {
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Middleware to populate req.user from session
  app.use(async (req: any, res, next) => {
    const userId = req.session?.userId;
    
    if (userId) {
      try {
        req.user = await storage.getUser(userId);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    }
    
    next();
  });
}

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    codeVerifier?: string;
  }
}