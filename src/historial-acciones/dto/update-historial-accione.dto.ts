import { PartialType } from '@nestjs/swagger';
import { CreateHistorialAccioneDto } from './create-historial-accione.dto';

export class UpdateHistorialAccioneDto extends PartialType(CreateHistorialAccioneDto) {}
