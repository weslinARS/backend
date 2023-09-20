import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
@Injectable()
export class ErrorCatcherMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.debug('entroooo');
    next();
  }
}
