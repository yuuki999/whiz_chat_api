import { AppError } from "./AppError";

export class AuthenticationException extends AppError {
  constructor(message: string = '認証に失敗しました') {
    super(message, 401, 'AUTHENTICATION_FAILED');
  }
}
