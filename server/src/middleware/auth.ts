import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;


export interface AuthenticatedRequest extends Request {
  userId?: number;
}

export const authenticateJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {  
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({
      type: 'error',
      message: 'Not authenticated. No token found.'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'userId' in decoded
    ) {
      req.userId = (decoded as { userId: number }).userId;
      next();
      return;
    } else {
      res.status(401).json({
        type: 'error',
        message: 'Invalid token payload.'
      });
      return;
    }
  } catch (err) {
    res.status(401).json({
      type: 'error',
      message: 'Token verification failed.'
    });
    return;
  }
};