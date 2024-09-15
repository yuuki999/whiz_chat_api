// // 認証関連（ログイン、ログアウト、FaceID）
// import express, { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import logger from '../../../utils/logger';

// const router = express.Router();

// // 仮のユーザーデータ（実際にはデータベースを使用します）
// const users = [
//   { id: 1, username: 'user1', password: 'password1' },
//   { id: 2, username: 'user2', password: 'password2' },
// ];

// // ログインエンドポイント
// router.post('/login', (req: Request, res: Response) => {
//   const { username, password } = req.body;
//   const user = users.find(u => u.username === username && u.password === password);

//   if (user) {
//     const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
//     logger.info('User logged in', { userId: user.id, username: user.username });
//     res.json({ token });
//   } else {
//     logger.warn('Login attempt failed', { username });
//     res.status(401).json({ error: 'Invalid credentials' });
//   }
// });

// // トークン検証ミドルウェア
// export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (token == null) {
//     logger.warn('Authentication failed: No token provided');
//     return res.sendStatus(401);
//   }

//   jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
//     if (err) {
//       logger.warn('Authentication failed: Invalid token', { error: err.message });
//       return res.sendStatus(403);
//     }
//     req.user = user;
//     next();
//   });
// };

// export default router;
