import express from 'express';
import consumerRoutes from './consumer';
import adminRoutes from './admin';

const router = express.Router();

router.use('/consumer', consumerRoutes);
router.use('/admin', adminRoutes);

export default router;
