import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtUtils';

// Requestインターフェースを拡張
declare global {
  namespace Express {
    interface Request {
      user?: any; // または、より具体的な型を使用
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
