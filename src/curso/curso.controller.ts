/* eslint-disable @typescript-eslint/no-unused-vars */
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
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { CursoService } from './curso.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Controller('curso')
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCursoDto: CreateCursoDto, @Req() req: Request) {
    const idUsuarioMaster = req['IdUsuario'];
    const rolUsuario = req['rol'];
    return this.cursoService.create(
      createCursoDto,
      idUsuarioMaster,
      rolUsuario,
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.cursoService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.cursoService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateCursoDto: UpdateCursoDto,
    @Req() req: Request,
  ) {
    const idUsuario = req['IdUsuario'];
    const rolUsuario = req['rol'];
    return this.cursoService.update(id, updateCursoDto, idUsuario, rolUsuario);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(201)
  remove(@Param('id') id: string, @Req() req: Request) {
    const idUsuario = req['IdUsuario'];
    const rolUsuario = req['rol'];
    return this.cursoService.remove(id, idUsuario, rolUsuario);
  }
}
