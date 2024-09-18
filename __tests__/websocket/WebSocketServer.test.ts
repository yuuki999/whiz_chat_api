import WebSocket from 'ws';
import { IncomingMessage, Server } from 'http';
import WebSocketServer from '../../src/websocket/WebSocketServer';

// この段階でimportしたものがモックとして認識される。
jest.mock('ws');
jest.mock('http');

describe('WebSocketServer', () => {
  let server: jest.Mocked<Server>;
  let wss: WebSocketServer;

  // テスト前に実行される処理
  beforeEach(() => {
    server = new Server() as jest.Mocked<Server>;// モックサーバーを作成
    wss = new WebSocketServer(server); // 実際のWebSocketServerを作成
  });

  test('WebSocket serverが初期化可能', () => {
    // WebSocketServerのコンストラクタでWebSocket.Serverが呼ばれていることを確認
    expect(WebSocket.Server).toHaveBeenCalledWith({ server });
  });
});
