import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  // 開発環境でのみ 'unsafe-inline' を追加
  const scriptSrc = process.env.NODE_ENV === 'development' 
    ? "'self' 'unsafe-inline'" 
    : "'self'";

  res.setHeader(
    'Content-Security-Policy',
    `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline'`
  );

  const html = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WebSocket Test</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            #messageList { border: 1px solid #ccc; height: 300px; overflow-y: auto; padding: 10px; margin-bottom: 10px; }
            input, button { margin: 5px 0; }
        </style>
    </head>
    <body>
        <h1>WebSocket Test</h1>
        <div id="messageList"></div>
        <input type="text" id="tokenInput" placeholder="認証トークンを入力">
        <button onclick="authenticate()">認証</button>
        <br>
        <input type="text" id="messageInput" placeholder="メッセージを入力">
        <button onclick="sendMessage()">送信</button>

        <script>
            let ws;
            const messageList = document.getElementById('messageList');

            function getWebSocketUrl() {
              const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
              const host = window.location.host;
              return \`\${protocol}//\${host}\`;
            }

            function connect() {
              const wsUrl = getWebSocketUrl();
              console.log('Connecting to WebSocket server at:', wsUrl);
              
              ws = new WebSocket(wsUrl);

              ws.onopen = () => {
                console.log('WebSocket接続が確立されました');
                addMessage('接続が確立されました');
              };

              // WSサーバーからメッセージを受信したときの処理
              ws.onmessage = (event) => {
                console.log('メッセージを受信:', event.data);
                addMessage('受信: ' + event.data);
              };

              ws.onclose = (event) => {
                console.log('WebSocket接続が閉じられました', event.code, event.reason);
                addMessage('接続が閉じられました');
              };

              ws.onerror = (error) => {
                console.error('WebSocketエラー:', error);
                addMessage('エラー: ' + (error.message || 'Unknown error'));
              };
            }

            function authenticate() {
                const token = document.getElementById('tokenInput').value;
                ws.send(JSON.stringify({ type: 'AUTH', token: token }));
            }

            function sendMessage() {
                const message = document.getElementById('messageInput').value;
                // メッセージをWSサーバーに送信
                ws.send(JSON.stringify({ 
                    type: 'SEND_MESSAGE', 
                    receiverId: 1, // ユーザーのID
                    content: message, 
                    contentType: 'text' 
                }));
                document.getElementById('messageInput').value = '';
            }

            function addMessage(message) {
                const messageElement = document.createElement('div');
                messageElement.textContent = message;
                messageList.appendChild(messageElement);
                messageList.scrollTop = messageList.scrollHeight;
            }

            connect();
        </script>
    </body>
    </html>
  `;

  res.send(html);
});
export default router;
