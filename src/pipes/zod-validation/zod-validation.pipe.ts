/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodObject } from 'zod';
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}
  transform(value: unknown, metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);
    if (result.success == false) {
      const messages = [];
      result.error.issues.forEach((issue) => {
        messages.push(issue.message);
      });
      throw new BadRequestException(messages);
    }
    return value;
  }
}
