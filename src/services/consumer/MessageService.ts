import { PrismaClient, Message } from '@prisma/client';
import { getErrorMessage } from '../../utils/getErrorMessage';

export class MessageService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async sendMessage(messageData: {
    senderId: number;
    receiverId?: number;
    groupId?: number;
    content: string;
    contentType: string;
  }): Promise<Message> {
    try {
      const message = await this.prisma.message.create({
        data: {
          senderId: messageData.senderId,
          receiverId: messageData.receiverId,
          groupId: messageData.groupId,
          content: messageData.content,
          contentType: messageData.contentType,
          isEncrypted: true, // デフォルトで暗号化
        },
      });
      return message;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  // 下記の方法のどれかでリアルタイム通信を実現したい。
  // WebSockets
  // NoSQLが必要かもしれない
  // Redisで比較的新しいデータはキャッシュして表示するといいかもしれない。
  // 実装の際に、気をつけること、
  // ・エラーハンドリングとリトライロジックを実装する必要があります。
  // ・スケーリングのために、Redis等を使用してWebSocketサーバー間でユーザーセッション情報を共有することを検討してください。
  // ・セキュリティ対策（メッセージの暗号化、レート制限など）を実装する必要があります。
  // ・オフライン時のメッセージ配信やプッシュ通知との統合も検討してください。
  public async getMessages(userId: number, limit?: number, offset?: number): Promise<Message[]> {
    try {
      const messages = await this.prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId },
            { group: { members: { some: { userId: userId } } } },
          ],
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          sender: true,
          receiver: true,
          group: true,
        },
      });
      return messages;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  public async getMessage(messageId: number): Promise<Message | null> {
    try {
      const message = await this.prisma.message.findUnique({
        where: { id: messageId },
        include: {
          sender: true,
          receiver: true,
          group: true,
        },
      });
      return message;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  public async markAsRead(messageId: number, userId: number): Promise<boolean> {
    try {
      const message = await this.prisma.message.findUnique({
        where: { id: messageId },
      });

      if (!message || (message.receiverId !== userId && !message.groupId)) {
        return false;
      }

      await this.prisma.message.update({
        where: { id: messageId },
        data: { 
          isRead: true,
          readAt: new Date(),
        },
      });

      return true;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  public async deleteMessage(messageId: number, userId: number): Promise<boolean> {
    try {
      const message = await this.prisma.message.findUnique({
        where: { id: messageId },
      });

      if (!message) {
        return false;
      }

      if (message.senderId === userId) {
        await this.prisma.message.update({
          where: { id: messageId },
          data: { deletedForSender: true },
        });
      } else if (message.receiverId === userId || message.groupId) {
        await this.prisma.message.update({
          where: { id: messageId },
          data: { deletedForReceiver: true },
        });
      } else {
        return false;
      }

      // メッセージが送信者と受信者の両方で削除された場合、完全に削除
      if (message.deletedForSender && message.deletedForReceiver) {
        await this.prisma.message.delete({
          where: { id: messageId },
        });
      }

      return true;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }
}
