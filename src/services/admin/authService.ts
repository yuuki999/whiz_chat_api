class AdminAuthService {
  async login(email: string, password: string) {
    // 1. メールアドレスでAdminを検索
    // 2. パスワードを検証
    // 3. JWTトークンを生成
    // 4. ログイン情報を返す
  }

  async register(adminData: any) {
    // 1. 管理者データのバリデーション
    // 2. 既存の管理者チェック
    // 3. パスワードのハッシュ化
    // 4. 新しい管理者の作成
    // 5. JWTトークンの生成
    // 6. 登録情報を返す
  }

  // その他の認証関連メソッド
}

export const adminAuthService = new AdminAuthService();
