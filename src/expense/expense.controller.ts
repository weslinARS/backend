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
import { ZodValidationPipe } from 'src/pipes/zod-validation/zod-validation.pipe';
import { AuthGuard } from '../guards/auth/auth.guard';
import { ExpenseObValidator } from '../validators/createExpenseObj.validator';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseService } from './expense.service';
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(ExpenseObValidator))
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createExpenseDto: CreateExpenseDto, @Req() req: Request) {
    const userId = req['user'];
    return this.expenseService.create(createExpenseDto, userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  findAll(@Req() req: Request) {
    const userId = req['user'];
    return this.expenseService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = req['user'];
    return this.expenseService.findOne(id, userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Req() req: Request,
  ) {
    const userId = req['user'];
    return this.expenseService.update(id, updateExpenseDto, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = req['user'];
    return this.expenseService.remove(id, userId);
  }
}
