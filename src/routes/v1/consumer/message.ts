import { NextFunction, Request, Response } from 'express';
import express from 'express';
import { body, param, query } from 'express-validator';
import { validateRequest } from '../../../middleware/validateRequest';
import { MessageController } from '../../../controllers/consumer/MessageController';
import { ResourceNotFoundException } from '../../../exception/ResourceNotFoundException';

const messageController = new MessageController();
const router = express.Router();

// メッセージを送信する
router.post('/',
  [
    body('senderId').isInt({ min: 1 }).withMessage('送信者IDは1以上の整数を指定してください'),
    body('receiverId').optional().isInt({ min: 1 }).withMessage('受信者IDは1以上の整数を指定してください'),
    body('groupId').optional().isInt({ min: 1 }).withMessage('グループIDは1以上の整数を指定してください'),
    body('content').isString().notEmpty().withMessage('メッセージ内容を指定してください'),
    body('contentType').isString().notEmpty().withMessage('コンテンツタイプを指定してください')
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await messageController.sendMessage(req.body, res);
      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  }
);

// メッセージを取得する
router.get('/',
  [
    query('userId').isInt({ min: 1 }).withMessage('ユーザーIDは1以上の整数を指定してください'),
    query('limit').optional().isInt({ min: 1 }).withMessage('表示件数は1以上の整数を指定してください'),
    query('offset').optional().isInt({ min: 0 }).withMessage('オフセットは0以上の整数を指定してください')
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.query.userId);
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const offset = req.query.offset ? Number(req.query.offset) : undefined;

      const messages = await messageController.getMessages(userId, limit, offset);
      res.json(messages);
    } catch (error) {
      next(error);
    }
  }
);

// 特定のメッセージを取得する
router.get('/:messageId',
  [
    param('messageId').isInt({ min: 1 }).withMessage('メッセージIDは1以上の整数を指定してください')
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messageId = Number(req.params.messageId);
      const message = await messageController.getMessage(messageId);
      if (!message) {
        throw new ResourceNotFoundException('メッセージが見つかりません');
      }
      res.json(message);
    } catch (error) {
      next(error);
    }
  }
);

// メッセージを既読にする
router.patch('/:messageId/read',
  [
    param('messageId').isInt({ min: 1 }).withMessage('メッセージIDは1以上の整数を指定してください'),
    body('userId').isInt({ min: 1 }).withMessage('ユーザーIDは1以上の整数を指定してください')
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messageId = Number(req.params.messageId);
      const userId = Number(req.body.userId);
      const result = await messageController.markAsRead(messageId, userId);
      if (!result) {
        throw new ResourceNotFoundException('メッセージが見つかりません');
      }
      res.json({ message: 'メッセージを既読にしました' });
    } catch (error) {
      next(error);
    }
  }
);

// メッセージを削除する
router.delete('/:messageId',
  [
    param('messageId').isInt({ min: 1 }).withMessage('メッセージIDは1以上の整数を指定してください'),
    body('userId').isInt({ min: 1 }).withMessage('ユーザーIDは1以上の整数を指定してください')
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messageId = Number(req.params.messageId);
      const userId = Number(req.body.userId);
      const result = await messageController.deleteMessage(messageId, userId);
      if (!result) {
        throw new ResourceNotFoundException('メッセージが見つかりません');
      }
      res.json({ message: 'メッセージを削除しました' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
