

import { Consumer } from '../../models/Consumer';
import { generateToken } from '../../utils/jwtUtils';

interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
  }
}

export class ConsumerAuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    // 1. メールアドレスでConsumerを検索
    // 2. パスワードを検証
    // 3. JWTトークンを生成
    // 4. ログイン情報を返す
    // 仮の実装例：
    const user = await this.findUserByEmail(email);
    if (!user || !this.verifyPassword(password, user.password)) {
      throw new Error('Invalid email or password');
    }
    const token = generateToken({ userId: user.id });
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    };
  }

  async register(consumerData: { email: string; password: string; username: string }): Promise<AuthResponse> {
    // 1. ユーザーデータのバリデーション
    // 2. 既存のユーザーチェック
    // 3. パスワードのハッシュ化
    // 4. 新しいユーザーの作成
    // 5. JWTトークンの生成
    // 6. 登録情報を返す
    // 仮の実装例：

    // TODO: これのAPIを実装するか。
    // まずはDBでモックを作成したい。
    // 1.マイグレーションツールの使用：データベーススキーマの変更を管理するために、db-migrateやsequelize-cliなどのマイグレーションツールを使用することをお勧めします。 db-migrateがいいかもしれない。
    // 2.シードデータの準備：テスト用のデータを簡単に投入できるよう、シードスクリプトを用意しておくと便利です。
    // 3.Docker Composeの活用：ローカル環境でPostgreSQLを簡単に起動できるよう、Docker Composeファイルを用意することをお勧めします。
    const existingUser = await this.findUserByEmail(consumerData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    const hashedPassword = await this.hashPassword(consumerData.password);
    const newUser = await this.createUser({
      ...consumerData,
      password: hashedPassword
    });
    const token = generateToken({ userId: newUser.id });
    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username
      }
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    // リフレッシュトークンの検証と新しいアクセストークンの生成
    // 仮の実装例：
    const decoded = this.verifyRefreshToken(refreshToken);
    const user = await this.findUserById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }
    const newToken = generateToken({ userId: user.id });
    return {
      token: newToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    };
  }

  // ヘルパーメソッド（実際の実装はデータベースとの連携が必要）
  private async findUserByEmail(email: string): Promise<Consumer | null> {
    // データベースからユーザーを検索する実装
    throw new Error('Not implemented');
  }

  private async findUserById(id: number): Promise<Consumer | null> {
    // データベースからユーザーを検索する実装
    throw new Error('Not implemented');
  }

  private async createUser(userData: { email: string; password: string; username: string }): Promise<Consumer> {
    // 新しいユーザーをデータベースに作成する実装
    throw new Error('Not implemented');
  }

  private async verifyPassword(inputPassword: string, storedPassword: string): Promise<boolean> {
    // パスワードを検証する実装（bcryptなどを使用）
    throw new Error('Not implemented');
  }

  private async hashPassword(password: string): Promise<string> {
    // パスワードをハッシュ化する実装（bcryptなどを使用）
    throw new Error('Not implemented');
  }

  private verifyRefreshToken(refreshToken: string): { userId: number } {
    // リフレッシュトークンを検証する実装
    throw new Error('Not implemented');
  }
}
