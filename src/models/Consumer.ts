export class Consumer {
  id: number;
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    email: string,
    username: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // メソッドの例
  getFullName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }

  // 静的メソッドの例（データベース操作を模倣）
  static async findByEmail(email: string): Promise<Consumer | null> {
    // ここで実際のデータベース操作を行う
    // この仮実装では、ダミーデータを返す
    if (email === 'test@example.com') {
      return new Consumer(1, email, 'testuser', 'hashedpassword', 'Test', 'User');
    }
    return null;
  }

  static async create(userData: Omit<Consumer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Consumer> {
    // ここで実際のデータベース操作を行う
    // この仮実装では、新しいConsumerインスタンスを作成して返す
    const newId = Math.floor(Math.random() * 1000) + 1; // ランダムなID生成
    return new Consumer(
      newId,
      userData.email,
      userData.username,
      userData.password,
      userData.firstName,
      userData.lastName
    );
  }

  // その他のCRUD操作メソッドをここに追加
}

// 型エイリアス（コントローラーやサービスで使用可能）
export type ConsumerCreationAttributes = Omit<Consumer, 'id' | 'createdAt' | 'updatedAt'>;
export type ConsumerAttributes = Omit<Consumer, 'password'>;
