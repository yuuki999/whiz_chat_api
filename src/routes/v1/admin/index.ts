import express, { Request, Response, NextFunction } from 'express';
// import authRoutes from './auth';
import logger from '../../../utils/logger';

const router = express.Router();

// ヘルスチェックエンドポイント
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'System is healthy' });
});

export default router;
