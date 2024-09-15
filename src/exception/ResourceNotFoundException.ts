import { AppError } from "./AppError";

export class ResourceNotFoundException extends AppError {
  constructor(message: string = 'リソースが見つかりません') {
    super(message, 404, 'RESOURCE_NOT_FOUND');
  }
}
