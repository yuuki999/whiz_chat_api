import { AppError } from "./AppError";

export class DataIntegrityException extends AppError {
  constructor(message: string = 'データ整合性エラーが発生しました') {
    super(message, 422, 'DATA_INTEGRITY_ERROR');
  }
}
