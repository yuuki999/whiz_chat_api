import express, { Request, Response } from 'express';
// import { authenticateToken } from './auth';
import logger from '../../../utils/logger';
import { UserController } from '../../../controllers/UserController';

const router = express.Router();
const userController = new UserController();

// 仮のユーザーデータ（実際にはデータベースを使用します）
const users = [
  { id: 1, username: 'user1', email: 'user1@example.com' },
  { id: 2, username: 'user2', email: 'user2@example.com' },
];

// 全ユーザー取得
router.get('/', (req: Request, res: Response) => {
  logger.info('Fetching all users');
  res.json(users.map(u => ({ id: u.id, username: u.username })));
});

// 特定のユーザー取得
router.get('/:userId', async (req: Request, res: Response) => {
  const user = await userController.getUser(parseInt(req.params.userId));
  res.json(user);
});

// ユーザープロフィール更新
router.put('/:id', (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const { username, email } = req.body;

  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], username, email };
    logger.info('User updated', { userId, username, email });
    res.json({ message: 'User updated successfully' });
  } else {
    logger.warn('User not found for update', { requestedId: userId });
    res.status(404).json({ error: 'User not found' });
  }
});

export default router;
