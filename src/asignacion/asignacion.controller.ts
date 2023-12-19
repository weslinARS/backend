import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { ZodValidationPipe } from 'src/pipes/zod-validation/zod-validation.pipe';
import { AsignacionService } from './asignacion.service';
import { CreateAsignacionDto } from './dto/create-asignacion.dto';
import { UpdateAsignacionDto } from './dto/update-asignacion.dto';
import { createAsignacionValidator } from './validators/create-asignacion.validator';

@Controller('asignacion')
export class AsignacionController {
  constructor(private readonly asignacionService: AsignacionService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createAsignacionValidator))
  create(
    @Body() createAsignacionDto: CreateAsignacionDto,
    @Req() req: Request,
  ) {
    const idUsuario = req['IdUsuario'];
    const rolUsuario = req['rol'];
    return this.asignacionService.create(
      createAsignacionDto,
      idUsuario,
      rolUsuario,
    );
  }

  // muestra todas las asignaciones de una asignatura especifica
  @Get('asignatura/:idAsignatura')
  @UseGuards(AuthGuard)
  findAll(@Req() req: Request, @Param('idAsignatura') idAsignatura: string) {
    const idUsuario = req['IdUsuario'];
    const rolUsuario = req['rol'];
    return this.asignacionService.findAllByAsignatura(
      idUsuario,
      rolUsuario,
      idAsignatura,
    );
  }
  //muestra una asignacion especifica
  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @Req() req: Request) {
    const idUsuario = req['IdUsuario'];
    const rolUsuario = req['rol'];
    return this.asignacionService.findOne(+id, idUsuario, rolUsuario);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateAsignacionDto: UpdateAsignacionDto,
    @Req() req: Request,
  ) {
    const idUsuario = req['IdUsuario'];
    const rolUsuario = req['rol'];
    return this.asignacionService.update(
      id,
      updateAsignacionDto,
      idUsuario,
      rolUsuario,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req: Request) {
    const idUsuario = req['IdUsuario'];
    const rolUsuario = req['rol'];
    return this.asignacionService.remove(+id, idUsuario, rolUsuario);
  }
}
