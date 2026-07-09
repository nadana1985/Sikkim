import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// ─── Configuration ───────────────────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET || 'monastery360-dev-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Parse expiresIn: accept seconds (number) or '24h'-style strings converted to seconds
function parseExpiresIn(val: string): number {
  const num = Number(val);
  if (!isNaN(num)) return num;
  const match = val.match(/^(\d+)(s|m|h|d)$/);
  if (!match) return 86400;
  const n = parseInt(match[1], 10);
  switch (match[2]) {
    case 's': return n;
    case 'm': return n * 60;
    case 'h': return n * 3600;
    case 'd': return n * 86400;
    default: return 86400;
  }
}

// ─── Extended Request Type ────────────────────────────────────────────────────

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
  };
}

// ─── Token Generation ────────────────────────────────────────────────────────

export function generateToken(payload: { id: string; email: string; role: string }): string {
  return jwt.sign(
    payload as unknown as jwt.JwtPayload,
    JWT_SECRET,
    { expiresIn: parseExpiresIn(JWT_EXPIRES_IN) }
  );
}

export function verifyToken(token: string): jwt.JwtPayload {
  return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
}

// ─── Authentication Middleware ────────────────────────────────────────────────

/**
 * Middleware to verify JWT token in Authorization header
 * Usage: router.post('/', authenticateToken, handler)
 */
export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <TOKEN>

  if (!token) {
    res.status(401).json({
      data: null,
      message: 'Access token required',
      statusCode: 401,
    });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    res.status(403).json({
      data: null,
      message: 'Invalid or expired token',
      statusCode: 403,
    });
  }
}

// ─── Role-Based Authorization ────────────────────────────────────────────────

/**
 * Middleware to check if user has required role
 * Usage: router.delete('/:id', authenticateToken, requireRole('admin'), handler)
 */
export function requireRole(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        data: null,
        message: 'Authentication required',
        statusCode: 401,
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        data: null,
        message: `Insufficient permissions. Required: ${roles.join(' or ')}`,
        statusCode: 403,
      });
      return;
    }

    next();
  };
}

// ─── Optional Authentication ─────────────────────────────────────────────────

/**
 * Middleware that attaches user if token is present, but doesn't require it
 * Usage: router.get('/', optionalAuth, handler)
 */
export function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = verifyToken(token);
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
    } catch {
      // Token invalid, but that's OK for optional auth
    }
  }

  next();
}
