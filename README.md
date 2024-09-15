# whiz_chat_backend

## 起動

開発モード
```
pnpm run dev
```

ビルド
```
pnpm run build
```

本番モード
```
pnpm start
``` 

## API設計書

下記にアクセスするとswaggerが表示される。
http://localhost:3000/api-docs/


## API設計とドキュメント生成

本プロジェクトでは、APIの設計とドキュメント生成にTSOA（TypeScript OpenAPI）を部分的に活用しています。  
TSOAは主に型安全性の確保とOpenAPI（Swagger）仕様の自動生成に使用し、実際のルーティングは独自の構造で実装しています。

### TSOAの主な利用ポイント

- **型安全性**: TypeScriptの型システムを活用して、APIの入出力を厳密に定義
- **自動ドキュメント生成**: コントローラーのコードからSwagger/OpenAPI仕様を自動生成
- **デコレータベースの設計**: アノテーションを使用して、エンドポイント、パラメータ、レスポンスタイプなどを定義

### カスタムルーティング

ルーティングは `src/routes` ディレクトリ内で独自に定義しています。

### 使用方法

1. コントローラーの定義:
   `src/controllers` ディレクトリ内にコントローラーを定義します。TSOAのデコレータを使用してエンドポイントやメソッドを指定します。

   例:
   ```typescript
   @Route("users")
   @Tags("User")
   export class UserController extends Controller {
     @Get("{userId}")
     public async getUser(@Path() userId: number): Promise<User> {
       // Implementation
     }
   }
   ```

2. ルーティングの実装:
   `src/routes` ディレクトリ内で、コントローラーのメソッドを呼び出すカスタムルーティングを実装します。

   例:
   ```typescript
   import express from 'express';
   import { UserController } from '../../controllers/UserController';

   const router = express.Router();
   const userController = new UserController();

   router.get('/:userId', async (req, res) => {
     const user = await userController.getUser(parseInt(req.params.userId));
     res.json(user);
   });

   export default router;
   ```

3. Swagger仕様の生成:
   以下のコマンドを実行して、Swagger仕様を生成します。
   ```
   pnpm run tsoa
   ```

4. 生成されたファイルの使用:
   - `swagger.json`: Swagger UIで使用、または他のツールでAPIドキュメントとして利用

### 注意事項

- コントローラーを変更した場合は、必ず `pnpm run tsoa` を実行してSwagger仕様を再生成してください。
- 生成された `swagger.json` は直接編集せず、常にTSOAを通じて更新してください。
- カスタムルーティングとSwagger仕様の整合性は手動で維持する必要があります。  
コントローラーを変更した場合は、対応するルーティングも適宜更新してください。
- TSOAによる自動的なリクエスト検証やレスポンス生成は行われないため、必要に応じて手動で実装してください。

TSOAの詳細な使用方法については、[公式ドキュメント](https://tsoa-community.github.io/docs/)を参照してください。カスタムルーティングの詳細な実装方法については、プロジェクト内の `src/routes` ディレクトリを参照してください。

TODO:
github actionで```pnpm run tsoa```を実行するようにする。


# エラーハンドリング戦略

## 基本原則

1. エラーは発生源に近い場所で捕捉し、適切な例外に変換する。
2. ビジネスロジックは、意味のある情報を持つカスタム例外をスローする。
3. ルーティング層では、グローバルなエラーハンドリングのみを行う。
4. すべての未処理の例外は、統一されたフォーマットでクライアントに返す。

## レイヤー別の責任

### 1. サービス層

- データアクセスやビジネスロジックに関連するエラーを捕捉する。
- 適切なカスタム例外に変換する。

例：
```typescript
class UserService {
  getUser(userId: number): User {
    const user = this.userRepository.findById(userId);
    if (!user) {
      throw new ResourceNotFoundException(`User with id ${userId} not found`);
    }
    return user;
  }
}
```

### 2. コントローラー層

- サービス層から受け取った例外を処理せず、そのまま上位層に伝播させる。

例：
```typescript
class UserController {
  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.getUser(req.params.userId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}
```

### 3. ルーティング層

- グローバルエラーハンドラーを使用し、全ての未処理の例外を捕捉する。
- 適切なHTTPステータスコードとエラーメッセージを含むレスポンスを生成する。

例：
```typescript
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error:', err);
  
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      errorCode: err.errorCode,
      message: err.message
    });
  } else {
    res.status(500).json({
      statusCode: 500,
      errorCode: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    });
  }
});
```

## カスタム例外

プロジェクト固有の例外を定義し、使用してください。以下は基本的な例外クラスの例です：

```typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public errorCode: string,
    message: string
  ) {
    super(message);
  }
}

export class ResourceNotFoundException extends AppError {
  constructor(message: string) {
    super(404, 'RESOURCE_NOT_FOUND', message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, 'VALIDATION_ERROR', message);
  }
}
```

## ベストプラクティス

1. 常に適切なカスタム例外を使用し、一般的な `Error` オブジェクトの使用は避ける。
2. エラーメッセージは具体的かつ有用なものにする。
3. 本番環境ではスタックトレースを含めない。
4. すべてのエラーを適切にログに記録する。
5. 入力バリデーションは可能な限り早い段階で行う。

## エラーレスポンスの形式

一貫性のあるエラーレスポンス形式を使用します：

```json
{
  "statusCode": 404,
  "errorCode": "RESOURCE_NOT_FOUND",
  "message": "User with id 123 not found"
}
```
