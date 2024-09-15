import { Request, Response, NextFunction } from 'express';
import { formatInTimeZone } from 'date-fns-tz';
import logger from '../utils/logger';

const TOKYO_TIMEZONE = 'Asia/Tokyo';

const formatToJST = (date: Date): string => {
  return formatInTimeZone(date, TOKYO_TIMEZONE, 'yyyy-MM-dd HH:mm:ss.SSSxxx');
};

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const startTimeJST = formatToJST(new Date(startTime));

  logger.info('Incoming request', {
    timestamp: startTimeJST,
    method: req.method,
    path: req.path,
    // headers: req.headers,
  });

  res.on('finish', () => {
    const endTime = Date.now();
    const endTimeJST = formatToJST(new Date(endTime));
    const responseTime = endTime - startTime;

    // レスポンス情報のログ
    logger.info('Response sent', {
      timestamp: endTimeJST,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
    });
  });

  next();
};
