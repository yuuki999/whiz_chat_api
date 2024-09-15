import logger from '../utils/logger';

interface User {
  id: number;
  username: string;
  email: string;
}

interface UserDTO {
  id: number;
  username: string;
}

export class UserService {
  // TODO: 仮のデータ、データベースから取得したい。
  private users = [
    { id: 1, username: 'user1', email: 'user1@example.com' },
    { id: 2, username: 'user2', email: 'user2@example.com' },
  ];

  getAllUsers(options: { limit?: number; offset?: number } = {}): UserDTO[] {
    const { limit, offset } = options;
    logger.info('Fetching all users', { limit, offset });

    return this.users
      .map(this.mapToDTO)
      .slice(offset || 0, limit ? (offset || 0) + limit : undefined);
  }

  getUser(userId: number): UserDTO | undefined {
    logger.info('Fetching user', { userId });
    const user = this.users.find(u => u.id === userId);
    return user ? this.mapToDTO(user) : undefined;
  }

  updateUser(userId: number, username?: string, email?: string) {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      if (username !== undefined) {
        this.users[userIndex].username = username;
      }
      if (email !== undefined) {
        this.users[userIndex].email = email;
      }
      logger.info('User updated', { userId, username, email });
      return true;
    }
    logger.warn('User not found for update', { requestedId: userId });
    return false;
  }

  private mapToDTO(user: User): UserDTO {
    return { id: user.id, username: user.username };
  }
}
