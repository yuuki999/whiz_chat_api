import * as WebSocket from 'ws';
import { IncomingMessage, Server } from 'http';
import WebSocketHandler from './WebSocketHandler';

export default class WebSocketServer {
  private wss: WebSocket.Server;

  constructor(server: Server) {
    this.wss = new WebSocket.Server({ server });
    this.init();
  }

  private init() {
    // クライアント側で接続要求があると、このコールバック関数が呼ばれる
    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      console.log('新しいWebSocket接続開始');
      const handler = new WebSocketHandler(ws);

      // クライアント側でメッセージを送信すると、このコールバック関数が呼ばれる
      ws.on('message', (message: string) => {
        console.log('メッセージ受信:', message);
        handler.handleMessage(message);
      });
  
      ws.on('error', (error) => {
        console.error('WebSocketエラー:', error);
      });
  
      ws.on('close', (code: number, reason: string) => {
        console.log(`WebSocket接続が閉じられました。コード: ${code}, 理由: ${reason}`);
        handler.handleClose();
      });
    });
  
    this.wss.on('error', (error) => {
      console.error('WebSocketサーバーエラー:', error);
    });
  }
}
