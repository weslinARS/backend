import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateHistorialAccioneDto } from './dto/create-historial-accione.dto';
import { HistorialAccionesService } from './historial-acciones.service';

@Controller('historial-acciones')
export class HistorialAccionesController {
  constructor(
    private readonly historialAccionesService: HistorialAccionesService,
  ) {}

  @Post()
  create(@Body() createHistorialAccioneDto: CreateHistorialAccioneDto) {
    return this.historialAccionesService.create(createHistorialAccioneDto);
  }

  @Get()
  findAll() {
    return this.historialAccionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historialAccionesService.findOne(+id);
  }

  @Get('/usuario/:id')
  findAllByUserId(@Param('id') id: string) {
    return this.historialAccionesService.findAllByUserId(id);
  }
}
