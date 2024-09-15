import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { AppError } from '../exception/AppError';

export const globalErrorHandler = (err: AppError | Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('エラー:', err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      errorCode: err.errorCode,
      message: err.message,
      stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined // セキュリティリスク回避のため、本番環境ではスタックトレースを返さない
    });
  } else {
    res.status(500).json({
      statusCode: 500,
      errorCode: 'UNKNOWN_SERVER_ERROR',
      message: '予期せぬエラーが発生しました',
      stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    });
  }
};
