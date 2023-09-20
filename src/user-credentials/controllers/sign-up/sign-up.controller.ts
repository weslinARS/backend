import { Body, Controller, Post, Req, Res, UsePipes } from '@nestjs/common';
import { Request, Response } from 'express';
import { ZodValidationPipe } from 'src/pipes/zod-validation/zod-validation.pipe';
import { UserCredentialsService } from 'src/user-credentials/user-credentials.service';
import { CreateUserDto } from '../../../Dto/create-User.dto';
import { CreateUserValidator } from '../../../validators/creatUser.validator';
@Controller('sign-up')
export class SignUpController {
  constructor(private userCredentialsService: UserCredentialsService) {}
  @Post()
  @UsePipes(new ZodValidationPipe(CreateUserValidator))
  async signUpUser(
    @Body() userInfo: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const newUser = await this.userCredentialsService.signUp(userInfo);
    if (newUser) {
      res.status(201).json({
        user: newUser,
      });
    }
  }
}
