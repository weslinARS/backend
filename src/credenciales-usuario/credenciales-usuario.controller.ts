import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodValidationPipe } from 'src/pipes/zod-validation/zod-validation.pipe';
import { CredencialesUsuarioService } from './credenciales-usuario.service';
import { CreateCredencialesUsuarioDto } from './dto/create-credenciales-usuario.dto';
import { CreateUsuarioDto } from './dto/create-usuario-dto';
import { nuevoUsuarioValidator } from './validator/nuevo-usuario.validator';
import { UserCredentialValidator } from './validator/user-credential.valitador';
@Controller('credenciales-usuario')
export class CredencialesUsuarioController {
  constructor(
    private readonly credencialesUsuarioService: CredencialesUsuarioService,
  ) {}
  @Post('log-in')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(UserCredentialValidator))
  async logIn(
    @Body() createCredencialesUsuarioDto: CreateCredencialesUsuarioDto,
    @Res() res: Response,
  ) {
    const usuarioLogueado = await this.credencialesUsuarioService.logIn(
      createCredencialesUsuarioDto,
    );
    if (usuarioLogueado) return res.status(201).json(usuarioLogueado);
  }
  @Post('sign-up')
  @UsePipes(new ZodValidationPipe(nuevoUsuarioValidator))
  signUp(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.credencialesUsuarioService.signUp(createUsuarioDto);
  }
}
