import express from 'express';
import consumerRoutes from './consumer';
import adminRoutes from './admin';

const router = express.Router();

router.use('/consumer', consumerRoutes);
// router.use('/consumer', publicRoutes); // TODO: 実装未定だが公開APIエンドポイントが必要な場合実装。
router.use('/admin', adminRoutes);

export default router;
