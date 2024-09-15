import { AppError } from "./AppError";

export class AuthorizationException extends AppError {
  constructor(message: string = '権限がありません') {
    super(message, 403, 'AUTHORIZATION_FAILED');
  }
}
