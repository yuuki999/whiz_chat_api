import express, { Express, Request, Response } from 'express';
import userRoutes from './routes/userRoutes';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger';
import { requestLogger } from './middleware/logger';


const app: Express = express();
const port = process.env.PORT || 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(requestLogger);

app.use(helmet());
app.use(cors({ // これの意味を調査する。
  origin: 'http://localhost:3000', // 指定されたoriginのみ許可、 '*' で全てのoriginを許可 TODO: Flutterと管理画面と自分自身のみ許可したい。
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.use('/api/users', userRoutes); // ルーティングを使用

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
