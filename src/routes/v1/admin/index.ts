import express, { Request, Response, NextFunction } from 'express';
// import authRoutes from './auth';
import logger from '../../../utils/logger';

const router = express.Router();

// ヘルスチェックエンドポイント
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'System is healthy' });
});

// router.use('/auth', authRoutes);

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('グローバルエラーハンドラー ', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Something went wrong!' });
});

export default router;
