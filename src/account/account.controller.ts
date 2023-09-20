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
import { CreateAccountObjValidator } from '../validators/createAccountObj.validator';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new ZodValidationPipe(CreateAccountObjValidator))
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAccountDto: CreateAccountDto, @Req() req: Request) {
    return this.accountService.create(createAccountDto, req);
  }
  @Get()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  findAll(@Req() req: Request) {
    const userId = req['user'];
    return this.accountService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = req['user'];
    console.log('para : ' + id);
    return this.accountService.findOne(id, userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
    @Req() req: Request,
  ) {
    const userId = req['user'];
    return this.accountService.update(id, updateAccountDto, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = req['user'];
    return this.accountService.remove(id, userId);
  }
}
