import { AppError } from "./AppError";

export class DuplicateEntryException extends AppError {
  constructor(message: string = '重複したエントリが存在します') {
    super(message, 409, 'DUPLICATE_ENTRY');
  }
}
