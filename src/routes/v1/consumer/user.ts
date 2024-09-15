import { NextFunction, Request, Response } from 'express';
import express from 'express';
import { UserController } from '../../../controllers/consumer/UserController';
import { body, param, query } from 'express-validator';
import { validateRequest } from '../../../middleware/validateRequest';

const userController = new UserController();
const router = express.Router();

router.get('/',
  [
    query('limit').optional().isInt({ min: 1 }).withMessage('表示件数は1以上の整数を指定してください'),
    query('offset').optional().isInt({ min: 0 }).withMessage('オフセットは0以上の整数を指定してください')
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const offset = req.query.offset ? Number(req.query.offset) : undefined;

      const users = await userController.getUsers(limit, offset);
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:userId',
  [
    param('userId').isInt({ min: 1 }).withMessage('ユーザーIDは1以上の整数を指定してください')
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = Number(req.params.userId);
    try {
      const user = await userController.getUser(userId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:userId',
  [
    param('userId').isInt({ min: 1 }).withMessage('ユーザーIDは1以上の整数を指定してください'),
    body('name').optional().isString().trim().notEmpty().withMessage('名前は空でない文字列を指定してください'),
    body('email').optional().isEmail().withMessage('有効なメールアドレスを指定してください'),
    body('age').optional().isInt({ min: 0 }).withMessage('年齢は0以上の整数を指定してください')
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId);
      const result = await userController.updateUser(userId, req.body);
      if (!result) {
        return res.status(404).json({ message: 'ユーザーが見つかりません' });
      }
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);


export default router;



