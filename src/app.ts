import express, { Express, Request, Response } from 'express';
import apiRouter from './routes/api';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { requestLogger } from './middleware/logger';
import swaggerJson from './swagger.json'; // TSOAが生成するファイル


const app: Express = express();
const port = process.env.PORT || 3000;

// Swagger UIをセットアップ
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));

app.use(express.json());
app.use(requestLogger);

app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000', // 指定されたoriginのみ許可、 '*' で全てのoriginを許可 TODO: Flutterと管理画面と自分自身のみ許可したい。
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
