import logger from '../utils/logger';

export class UserService {
  private users = [
    { id: 1, username: 'user1', email: 'user1@example.com' },
    { id: 2, username: 'user2', email: 'user2@example.com' },
  ];

  getAllUsers(limit?: number, offset?: number) {
    logger.info('Fetching all users', { limit, offset });
    let result = this.users.map(u => ({ id: u.id, username: u.username }));
    
    if (offset !== undefined) {
      result = result.slice(offset);
    }
    if (limit !== undefined) {
      result = result.slice(0, limit);
    }
    
    return result;
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
}
