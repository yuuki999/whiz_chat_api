# whiz_chat_backend

## 起動

dockerコンテナを構築
```
docker-compose up --build
```

コンテナを起動。
```
docker-compose up -d
```

これでAPIに疎通できる。

### appコンテナの内部で色々操作したい場合。

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

## Prisma

このプロジェクトではPrismaを使用してデータベースマイグレーションを管理しています。  
公式ドキュメント  
https://www.prisma.io/docs/orm/reference/prisma-schema-reference

### 1. モデルの作成・更新
```prisma/schema.prisma```ファイルを編集して、新しいモデルを追加するか既存のモデルを更新します。
例:
```
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

### 2. マイグレーションファイルの生成
モデルの変更を行った後、以下のコマンドを実行してマイグレーションファイルを生成します。
```
npx prisma migrate dev --name <変更の説明: 例えばinitとか>
```

### 3. マイグレーションの適用（開発環境）
開発中に新しい変更をデータベースに適用する場合は、以下のコマンドを使用します。
```
npx prisma migrate deploy
```

### 4. マイグレーションの適用（本番環境）
本番環境や他の環境（ステージングなど）でマイグレーションを適用する場合は、以下のコマンドを使用します。

### 5. Prisma Client の生成
データベーススキーマを変更した後、または明示的に Prisma Client を更新したい場合は、以下のコマンドを実行します。
```
npx prisma generate
```

これを実行することで、下記を実現できます。
- 型安全性の確保
データベーススキーマに基づいて TypeScript の型定義を生成します。
これにより、開発時に型チェックが可能になり、多くのバグを事前に防ぐことができます。
- クエリ API の更新
スキーマの変更に応じて、新しいクエリメソッドや既存メソッドの引数を更新します。
例えば、新しいモデルや関係性を追加した場合、それらに対応するクエリメソッドが生成されます。

### prismaで生成される型の使用について

下記のように使用することが可能。
```
import { Prisma, User } from '@prisma/client'

// 完全なUser型
type FullUser = User

// User型から特定のフィールドを除外した型
type UserWithoutSensitiveInfo = Omit<User, 'passwordHash' | 'isAdmin'>

// 新規ユーザー作成時に使用する型
type CreateUserInput = Prisma.UserCreateInput

// ユーザー更新時に使用する型
type UpdateUserInput = Prisma.UserUpdateInput

// ユーザー検索時に使用する型
type UserWhereInput = Prisma.UserWhereInput

export {
  FullUser,
  UserWithoutSensitiveInfo,
  CreateUserInput,
  UpdateUserInput,
  UserWhereInput
}
```

### トラブルシューティング
マイグレーションに問題が発生した場合は、以下のコマンドでデータベースの状態を確認できます。
```
npx prisma migrate status
```


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




## 便利コマンド


```
tree -I 'node_modules|dist|.git'
```



## TODO

- Joi, Yupとはバリデーションライブラリだが何か。prismaとの関連性はあるか。
- Prisma Studioの使い方
- TypedSQL,生SQLに対して自動で型を付けてくれる機能があるらしいキャッチアップしておきたい
- コードを書く時に、型推論を使用して明示的な型を表現をしないことも選択肢に入れる。


これを使えばうまくいくかも
install bcryptjs --save


