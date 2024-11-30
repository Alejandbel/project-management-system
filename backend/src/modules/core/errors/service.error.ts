import { AppError } from './app.error';

export class ServiceError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}
