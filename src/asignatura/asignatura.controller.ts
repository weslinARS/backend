import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { ZodValidationPipe } from 'src/pipes/zod-validation/zod-validation.pipe';
import { AsignaturaService } from './asignatura.service';
import { CreateAsignaturaDto } from './dto/create-asignatura.dto';
import { UpdateAsignaturaDto } from './dto/update-asignatura.dto';
import { CreateAsignaturaValidator } from './validators/create-asignatura.validator';

@Controller('asignatura')
export class AsignaturaController {
  constructor(private readonly asignaturaService: AsignaturaService) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(CreateAsignaturaValidator))
  create(
    @Body() createAsignaturaDto: CreateAsignaturaDto,
    @Req() req: Request,
  ) {
    const idUsuario = req['IdUsuario'];
    const rolUsuario = req['rol'];
    return this.asignaturaService.create(
      createAsignaturaDto,
      idUsuario,
      rolUsuario,
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  findAll(@Req() req: Request) {
    const idUsuario = req['IdUsuario'];
    const rolUsuario = req['rol'];
    return this.asignaturaService.findAll(idUsuario, rolUsuario);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.asignaturaService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateAsignaturaDto: UpdateAsignaturaDto,
    @Req() req: Request,
  ) {
    const rol = req['rol'];
    const idUsuario = req['IdUsuario'];
    return this.asignaturaService.update(
      id,
      updateAsignaturaDto,
      idUsuario,
      rol,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string, @Req() req: Request) {
    const rol = req['rol'];
    const idUsuario = req['IdUsuario'];
    return this.asignaturaService.remove(id, idUsuario, rol);
  }
}
