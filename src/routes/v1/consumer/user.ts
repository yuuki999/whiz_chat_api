import express, { Request, Response, NextFunction } from 'express';
// import { authenticateToken } from './auth';
import { UserController } from '../../../controllers/UserController';

const router = express.Router();
const userController = new UserController();

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const offset = req.query.offset ? Number(req.query.offset) : undefined;
  const users = await userController.getUsers(limit, offset);
  res.json(users);
}));

router.get('/:userId', asyncHandler(async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const user = await userController.getUser(userId);
  res.json(user);
}));

router.patch('/:userId', asyncHandler(async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const result = await userController.updateUser(userId, req.body);
  res.json(result);
}));

export default router;
