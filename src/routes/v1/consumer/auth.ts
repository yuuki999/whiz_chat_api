import { NextFunction, Request, Response } from 'express';
import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../../../middleware/validateRequest';
import { ConsumerAuthService } from '../../../services/consumer/authService';
import { ConsumerAuthController } from '../../../controllers/consumer/ConsumerAuthController';
import { lightFormat } from 'date-fns';

const router = express.Router();
const authService = new ConsumerAuthService();
const authController = new ConsumerAuthController(authService);

router.post('/register',
  [
    body('name').isString().notEmpty().withMessage('名前を指定してください'),
    body('email').isEmail().withMessage('有効なメールアドレスを指定してください'),
    body('password').isLength({ min: 8 }).withMessage('パスワードは8文字以上で指定してください'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authController.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/login',
  [
    body('email').isEmail().withMessage('有効なメールアドレスを指定してください'),
    body('password').isString().notEmpty().withMessage('パスワードを指定してください')
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authController.login(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/logout',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // ここでは、クライアントサイドでトークンを削除する想定のため、
      // サーバーサイドでの特別な処理は行わず、成功レスポンスを返します
      res.json({ message: 'ログアウトしました' });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/refresh-token',
  [
    body('refreshToken').isString().notEmpty().withMessage('リフレッシュトークンを指定してください')
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authController.refreshToken(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
