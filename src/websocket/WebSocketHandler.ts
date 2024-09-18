import * as WebSocket from 'ws';
import { MessageService } from '../services/consumer/MessageService';
import { AuthenticationException } from '../exception/AuthenticationException';
import { ConsumerAuthService } from '../services/consumer/AuthService';

// チャット機能が必要なのでwebsocketを検証してみたけど、リアルタイムデータベース＋FCMの方が良さそう。念の為残しておく。
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


// 実装のメモ、websocketとFCMの併用
// // クライアント側
// import * as WebSocket from 'ws';
// import firebase from 'firebase/app';
// import 'firebase/messaging';

// class ChatClient {
//   private ws: WebSocket | null = null;
//   private fcmToken: string | null = null;

//   constructor() {
//     this.initializeFCM();
//   }

//   private async initializeFCM() {
//     const messaging = firebase.messaging();
//     try {
//       this.fcmToken = await messaging.getToken();
//       console.log('FCMトークン:', this.fcmToken);
//       // FCMトークンをサーバーに送信
//       this.sendFCMTokenToServer(this.fcmToken);
//     } catch (error) {
//       console.error('FCMトークンの取得に失敗:', error);
//     }
//   }

//   public openWebSocketConnection() {
//     this.ws = new WebSocket('wss://your-server-url');
//     this.ws.onopen = () => {
//       console.log('WebSocket接続が確立されました');
//     };
//     this.ws.onmessage = (event) => {
//       console.log('メッセージを受信:', event.data);
//       // 受信したメッセージを処理
//     };
//     this.ws.onclose = () => {
//       console.log('WebSocket接続が閉じられました');
//     };
//   }

//   public closeWebSocketConnection() {
//     if (this.ws) {
//       this.ws.close();
//       this.ws = null;
//     }
//   }

//   private sendFCMTokenToServer(token: string) {
//     // FCMトークンをサーバーに送信するロジック
//   }
// }

// // アプリケーションの状態に応じて接続を管理
// const chatClient = new ChatClient();

// // トーク画面を開いたとき
// function onEnterChatScreen() {
//   chatClient.openWebSocketConnection();
// }

// // トーク画面を閉じたとき
// function onLeaveChatScreen() {
//   chatClient.closeWebSocketConnection();
// }

// // サーバー側
// import * as WebSocket from 'ws';
// import * as admin from 'firebase-admin';

// class ChatServer {
//   private wss: WebSocket.Server;

//   constructor() {
//     this.wss = new WebSocket.Server({ port: 8080 });
//     this.initializeWebSocket();
//     this.initializeFCM();
//   }

//   private initializeWebSocket() {
//     this.wss.on('connection', (ws) => {
//       console.log('新しいWebSocket接続');
//       ws.on('message', (message) => {
//         console.log('メッセージを受信:', message);
//         // メッセージを処理して、必要に応じて他のクライアントに送信
//       });
//     });
//   }

//   private initializeFCM() {
//     admin.initializeApp({
//       credential: admin.credential.applicationDefault(),
//       // その他の設定
//     });
//   }

//   public sendMessage(userId: string, message: string) {
//     const activeClient = this.findActiveWebSocketClient(userId);
//     if (activeClient) {
//       // WebSocket経由でメッセージを送信
//       activeClient.send(JSON.stringify(message));
//     } else {
//       // FCM経由でプッシュ通知を送信
//       this.sendPushNotification(userId, message);
//     }
//   }

//   private findActiveWebSocketClient(userId: string): WebSocket | null {
//     // ユーザーIDに基づいてアクティブなWebSocketクライアントを探す
//     // 実際の実装では、接続時にユーザーIDを関連付ける必要があります
//     return null;
//   }

//   private async sendPushNotification(userId: string, message: string) {
//     try {
//       const token = await this.getFCMTokenForUser(userId);
//       const response = await admin.messaging().send({
//         token: token,
//         notification: {
//           title: '新しいメッセージ',
//           body: message
//         }
//       });
//       console.log('プッシュ通知送信成功:', response);
//     } catch (error) {
//       console.error('プッシュ通知送信エラー:', error);
//     }
//   }

//   private async getFCMTokenForUser(userId: string): Promise<string> {
//     // ユーザーIDに基づいてFCMトークンを取得する
//     // 実際の実装では、データベースからトークンを取得する必要があります
//     return 'dummy-fcm-token';
//   }
// }

// const chatServer = new ChatServer();
