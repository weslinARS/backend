import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account, AccountObject } from './entities/account.entity';
@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name)
    private accountModel: Model<Account>,
    @InjectModel(AccountObject.name)
    private accountObjectModel: Model<AccountObject>,
  ) {}
  async create(createAccountDto: CreateAccountDto, req: Request) {
    const userId = req['user'];
    // find if alredy exists an account document for the user id
    if (!this.checkIfAccountExists(userId)) {
      // ! Create a account document for this user
      try {
        // ! Create a account object
        const newAccObject = new this.accountObjectModel(createAccountDto);
        await this.accountModel.create({
          userId,
          Accounts: [newAccObject],
        });
        return newAccObject;
      } catch (error) {
        throw new InternalServerErrorException(
          'Error al crear la cuenta' + error.message,
        );
      }
    } else {
      //! Check if the account name already exists
      const accountName = createAccountDto.accountName;
      const accountNameExists = await this.accountModel.findOne({
        userId,
        'Accounts.accountName': accountName,
      });
      if (accountNameExists) {
        throw new BadRequestException('El nombre de la cuenta ya existe');
      }
      // ! Create a account object and push it to the array
      try {
        const newAccObject = new this.accountObjectModel(createAccountDto);
        await this.accountModel.findOneAndUpdate(
          { userId },
          { $push: { Accounts: newAccObject } },
        );
        return newAccObject;
      } catch (error) {
        throw new InternalServerErrorException(
          'Error al crear la cuenta' + error.message,
        );
      }
    }
  }

  async findAll(userId: string) {
    if (this.checkIfAccountExists(userId)) {
      const AccountsArray = await this.accountModel
        .findOne({ userId: userId })
        .select('-__v')
        .select('-_id')
        .select('-userId');
      return AccountsArray;
    }
    throw new NotFoundException('No se ha encontrado la cuenta');
  }

  async findOne(id: string, userId: string) {
    if (this.checkIfAccountExists(userId)) {
      //get the account object inside the array of accounts
      const accounts = await this.accountModel
        .findOne({ userId: userId })
        .select('-__v')
        .select('-_id')
        .select('-userId')
        .select('Accounts');
      const account = accounts.Accounts.find(
        (acc) => acc['_id' as keyof object] == id,
      );
      if (!account) {
        throw new NotFoundException('No se ha encontrado la cuenta');
      }
      return account;
    }
    return new NotFoundException('No se ha encontrado la cuenta');
  }

  async update(id: string, updateAccountDto: UpdateAccountDto, userId: string) {
    if (!this.checkIfAccountExists(userId))
      throw new NotFoundException('No se ha encontrado la cuenta');
    try {
      const AccountDoc = await this.accountModel.findOne({ userId: userId });
      // get the index of the account object inside the array of accounts
      const accountIndex = AccountDoc.Accounts.findIndex(
        (acc) => acc['_id' as keyof object] == id,
      );
      if (accountIndex == -1)
        throw new NotFoundException('No se ha encontrado la cuenta');
      // update the account object
      AccountDoc.Accounts[accountIndex] = {
        ...AccountDoc.Accounts[accountIndex],
        ...updateAccountDto,
      };
      await AccountDoc.save();
      return;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al actualizar la cuenta:  ' + error.message,
      );
    }
  }

  async remove(id: string, userId: string) {
    if (!this.checkIfAccountExists(userId))
      throw new NotFoundException('No se ha encontrado las cuentas');
    try {
      const AccountDoc = await this.accountModel.findOne({ userId: userId });
      // get the index of the account object inside the array of accounts
      const accountIndex = AccountDoc.Accounts.findIndex(
        (acc) => acc['_id' as keyof object] == id,
      );
      if (accountIndex == -1)
        throw new NotFoundException('No se ha encontrado la cuenta');
      AccountDoc.Accounts.splice(accountIndex, 1);
      await AccountDoc.save();
      return;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al eliminar la cuenta:  ' + error.message,
      );
    }
  }

  private async checkIfAccountExists(userId: string): Promise<boolean> {
    const accountDoc = await this.accountModel.findOne({ userId });
    if (!accountDoc) return false;
    return true;
  }
}
