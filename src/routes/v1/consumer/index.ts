import express, { Request, Response, NextFunction } from 'express';
import userRoutes from './user';
import authRoutes from './auth';

const router = express.Router();

// ヘルスチェックエンドポイント(将来的に自動スケーリングを導入するときに使う)
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'System is healthy' });
});

// 認証関連
router.use('/auth', authRoutes);
// ユーザープロフィール、設定
router.use('/users', userRoutes);

// その他APIエンドポイント...

export default router;
