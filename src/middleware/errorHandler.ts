import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { AppError } from '../exception/AppError';

export const globalErrorHandler = (err: AppError | Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('エラー:', err);

  if (err instanceof AppError) {
    const responseBody: any = {
      statusCode: err.statusCode,
      errorCode: err.errorCode,
      message: err.message,
    };

    res.status(err.statusCode).json(responseBody);
  } else {
    const responseBody: any = {
      statusCode: 500,
      errorCode: 'UNKNOWN_SERVER_ERROR',
      message: err.message || '予期せぬエラーが発生しました',
    };

    res.status(500).json(responseBody);
  }
};
