import * as WebSocket from 'ws';
import { MessageService } from '../services/consumer/MessageService';
import { AuthenticationException } from '../exception/AuthenticationException';
import { ConsumerAuthService } from '../services/consumer/AuthService';

export default class WebSocketHandler {
  private ws: WebSocket;
  private userId: number | null = null;
  private messageService: MessageService;
  private authService: ConsumerAuthService;

  constructor(ws: WebSocket) {
    this.ws = ws;
    this.messageService = new MessageService();
    this.authService = new ConsumerAuthService();
  }

  public async handleMessage(message: string) {
    try {
      const data = JSON.parse(message);
    
      switch (data.type) {
        case 'AUTH':
          await this.handleAuth(data.token);
          break;
        case 'SEND_MESSAGE':
          await this.handleSendMessage(data);
          break;
      }
    } catch (error) {
      console.error('Error handling message:', error);
      this.ws.send(JSON.stringify({ type: 'ERROR', message: 'Internal server error' }));
    }
  }

  private async handleAuth(accessToken: string) {
    try {
      const { user } = await this.authService.verifyAccessToken(accessToken);
      this.userId = user.id;
      this.ws.send(JSON.stringify({ 
        type: 'AUTH_SUCCESS',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }));
    } catch (error) {
      if (error instanceof AuthenticationException) {
        this.ws.send(JSON.stringify({ type: 'AUTH_FAILED', message: error.message }));
      } else {
        console.error('Authentication error:', error);
        this.ws.send(JSON.stringify({ type: 'AUTH_FAILED', message: 'Internal server error' }));
      }
    }
  }

  private async handleSendMessage(data: any) {
    if (!this.userId) {
      this.ws.send(JSON.stringify({ type: 'ERROR', message: 'Not authenticated' }));
      return;
    }

    try {
      // メッセージを保存する
      const message = await this.messageService.sendMessage({
        senderId: this.userId,
        receiverId: data.receiverId,
        content: data.content,
        contentType: data.contentType
      });

      // メッセージを送信者と受信者に配信
      this.broadcastMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
      this.ws.send(JSON.stringify({ type: 'ERROR', message: 'Failed to send message' }));
    }
  }

  private broadcastMessage(message: any) {
    // TODO: 実際の実装では、接続されている全クライアントから
    // 送信者と受信者を見つけて、それらにのみメッセージを送信します
    this.ws.send(JSON.stringify({
      type: 'NEW_MESSAGE',
      message: message
    }));
  }

  public handleClose() {
    // 接続が閉じられたときの処理
    // 例: オンラインステータスの更新など
    this.userId = null;
  }
}
