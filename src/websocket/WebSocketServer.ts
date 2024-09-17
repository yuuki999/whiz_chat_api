import * as WebSocket from 'ws';
import { Server } from 'http';
import WebSocketHandler from './WebSocketHandler';

export default class WebSocketServer {
  private wss: WebSocket.Server;

  constructor(server: Server) {
    this.wss = new WebSocket.Server({ server });
    this.init();
  }

  private init() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('新しいWebSocket接続開始');
      
      const handler = new WebSocketHandler(ws);
      
      ws.on('message', (message: string) => {
        handler.handleMessage(message);
      });

      ws.on('close', () => {
        console.log('WebSocket接続が閉じられました');
        handler.handleClose();
      });
    });
  }
}
