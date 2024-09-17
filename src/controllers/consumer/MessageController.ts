import { Request, Response } from 'express';
import { AppError } from '../../exception/AppError';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { ResourceNotFoundException } from '../../exception/ResourceNotFoundException';
import { MessageService } from '../../services/consumer/MessageService';

export class MessageController {
  private messageService: MessageService;

  constructor() {
    this.messageService = new MessageService();
  }

  public sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const message = await this.messageService.sendMessage(req.body);
      res.status(201).json(message);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  public getMessages = async (userId: number, limit?: number, offset?: number): Promise<any> => {
    try {
      const messages = await this.messageService.getMessages(userId, limit, offset);
      return messages;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  public getMessage = async (messageId: number): Promise<any> => {
    try {
      const message = await this.messageService.getMessage(messageId);
      if (!message) {
        throw new ResourceNotFoundException('メッセージが見つかりません');
      }
      return message;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new Error(getErrorMessage(error));
    }
  };

  public markAsRead = async (messageId: number, userId: number): Promise<boolean> => {
    try {
      const result = await this.messageService.markAsRead(messageId, userId);
      if (!result) {
        throw new ResourceNotFoundException('メッセージが見つかりません');
      }
      return result;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new Error(getErrorMessage(error));
    }
  };

  public deleteMessage = async (messageId: number, userId: number): Promise<boolean> => {
    try {
      const result = await this.messageService.deleteMessage(messageId, userId);
      if (!result) {
        throw new ResourceNotFoundException('メッセージが見つかりません');
      }
      return result;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new Error(getErrorMessage(error));
    }
  };
}
