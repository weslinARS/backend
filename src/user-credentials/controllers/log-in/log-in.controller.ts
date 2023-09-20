import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { ZodValidationPipe } from 'src/pipes/zod-validation/zod-validation.pipe';
import { CreateUserCredentialsDto } from '../../../Dto/create-UserCredentials.dto';
import { UserCredentialValidator } from '../../../validators/UserCredential.validator';
import { UserCredentialsService } from '../../user-credentials.service';
@Controller('log-in')
export class LogInController {
  constructor(private userCredentialsService: UserCredentialsService) {}
  @Post()
  @UsePipes(new ZodValidationPipe(UserCredentialValidator))
  async logIn(
    @Body() userCredentials: CreateUserCredentialsDto,
    @Res() res: Response,
  ) {
    const userLogged = await this.userCredentialsService.logIn(userCredentials);
    if (userLogged) return res.status(200).json(userLogged);
  }
}
