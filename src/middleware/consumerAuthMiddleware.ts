import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwtUtils';
import { AuthenticationException } from '../exception/AuthenticationException';
import { getErrorMessage } from '../utils/getErrorMessage';

export const consumerAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return next(new AuthenticationException('アクセストークンを設定してください'));
  }

  try {
    verifyAccessToken(token);
    // トークンが有効であれば、次のミドルウェアに進む
    next();
  } catch (error) {
    next(new AuthenticationException(getErrorMessage(error)));
  }
};
