import { Request, Response } from 'express';
import { UserController } from '../../../controllers/UserController';
import { CustomRouter } from '../../../utils/customRouter';

const userController = new UserController();
const router = new CustomRouter();

router.get('/', async (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const offset = req.query.offset ? Number(req.query.offset) : undefined;
  const users = await userController.getUsers(limit, offset);
  res.json(users);
});

router.get('/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const user = await userController.getUser(userId);
  res.json(user);
});

router.patch('/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const result = await userController.updateUser(userId, req.body);
  res.json(result);
});

export default router.getRouter();



