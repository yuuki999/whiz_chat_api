import express, { Express, Request, Response } from 'express';
import apiRouter from './routes/api';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { requestLogger } from './middleware/logger';
import swaggerJson from './swagger.json'; // TSOAが生成するファイル
import { globalErrorHandler } from './middleware/errorHandler';
import http from 'http';
import WebSocketServer from './websocket/WebSocketServer';


const app: Express = express();
const port = process.env.PORT || 3000;

// WebSocketサーバーの初期化
const server = http.createServer(app);
new WebSocketServer(server);

// SwaggerUIの設定
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));
// CORSの設定
app.use(cors({
  origin: 'http://localhost:3000', // 指定されたoriginのみ許可、 '*' で全てのoriginを許可 TODO: Flutterと管理画面と自分自身のみ許可したい。
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(requestLogger);
app.use(helmet());
// ルートパスへのアクセス
app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, World!');
});
// APIのエンドポイント
app.use('/api', apiRouter);
// グローバルエラーハンドラー(APIでエラーがあるとここにくる)
app.use(globalErrorHandler);

// サーバー起動設定
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
