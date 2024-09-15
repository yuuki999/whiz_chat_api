import { Get, Patch, Path, Route, Tags, Query, Body } from "tsoa";
import { UserService } from '../services/userService';

interface User {
  id: number;
  username: string;
}

interface UpdateUserRequest {
  username?: string;
  email?: string;
}

@Route("users")
@Tags("User")
export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  @Get()
  async getUsers(@Query() limit?: number, @Query() offset?: number): Promise<User[]> {
    return this.userService.getAllUsers(limit, offset);
  }

  @Get("{userId}")
  async getUser(@Path() userId: number): Promise<User> {
    const users = this.userService.getAllUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  @Patch("{userId}")
  async updateUser(@Path() userId: number, @Body() requestBody: UpdateUserRequest): Promise<{ message: string }> {
    const success = await this.userService.updateUser(userId, requestBody.username, requestBody.email);
    if (success) {
      return { message: 'User updated successfully' };
    } else {
      throw new Error('User not found');
    }
  }
}
