import { Controller, Get, Path, Route, Tags } from "tsoa";

interface User {
  id: number;
  name: string;
  email: string;
}

@Route("users")
@Tags("User")
export class UserController extends Controller {
  @Get("{userId}")
  public async getUser(@Path() userId: number): Promise<User> {
    // ここで実際のユーザー取得ロジックを実装
    return {
      id: userId,
      name: "John Doe",
      email: "john@example.com"
    };
  }

  @Get()
  public async getUsers(): Promise<User[]> {
    // ここで実際のユーザー一覧取得ロジックを実装
    return [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Doe", email: "jane@example.com" }
    ];
  }
}
