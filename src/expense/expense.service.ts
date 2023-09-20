/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountObject } from 'src/Schemas/Accounts.schema';
import { Account, AccountDocument } from '../account/entities/account.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense, ExpenseObject } from './entities/expense.entity';
@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(AccountObject.name)
    private accountObjectModel: Model<AccountObject>,
    @InjectModel(Account.name) private accountModel: Model<Account>,
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    @InjectModel(ExpenseObject.name)
    private expenseObjectModel: Model<ExpenseObject>,
  ) {}
  async create(createExpenseDto: CreateExpenseDto, userId: string) {
    const accountName = createExpenseDto.accountName;
    // check it the target account exists
    const targetAcc = await this.getAccountDocument(userId, accountName);
    // reduce the account balance by the amount if the account is of type 'saving'
    if (this.checkIfAccountIsSaving(targetAcc, accountName)) {
      const result: boolean = await this.reduceAccountAmount(
        targetAcc,
        createExpenseDto.expenseAmount,
        accountName,
      );
      if (!result)
        throw new InternalServerErrorException(
          'No se pudo reducir el monto de la cuenta de ahorro',
        );
    }
    // check if the user has an expense document
    if (!(await this.checkIfExpensesExists(userId))) {
      // create a expense object for this user;
      const newExpenseObject = new this.expenseObjectModel(createExpenseDto);
      // create a expense document for this user;
      const expenseDoc = await this.expenseModel.create({
        userId: userId,
        Expenses: [newExpenseObject],
      });
      return expenseDoc;
    } else {
      // create add an expense object to the array of the current user
      try {
        const newExpenseObject = new this.expenseObjectModel(createExpenseDto);
        await this.expenseModel.findOneAndUpdate(
          {
            userId: userId,
          },
          { $push: { Expenses: newExpenseObject } },
        );
        return newExpenseObject;
      } catch (error) {
        throw new InternalServerErrorException(
          'Error al crear el gasto' + error.message,
        );
      }
    }
  }

  async findAll(userId: string) {
    if (this.checkIfExpensesExists(userId)) {
      const expenseArray = await this.expenseModel
        .findOne({
          userId: userId,
        })
        .select('-__v')
        .select('-_id')
        .select('-userId');
      return expenseArray;
    }
    throw new NotFoundException('No se ha encontrado el gasto para el usuario');
  }

  async findOne(id: string, userId: string) {
    if (this.checkIfExpensesExists(userId)) {
      const expenses = await this.expenseModel
        .findOne({
          userId: userId,
        })
        .select('-__v')
        .select('-_id')
        .select('-userId')
        .select('Expenses');
      const expense = expenses.Expenses.find(
        (exp) => exp['_id' as keyof object] == id,
      );
      if (!expense) {
        throw new NotFoundException('No se ha encontrado el gasto');
      }
      return expense;
    }
    return new NotFoundException('No se ha encontrado el gasto');
  }

  update(id: string, updateExpenseDto: UpdateExpenseDto, userId: string) {
    return `This action updates a #${id} expense`;
  }

  async remove(id: string, userId: string) {
    if (!this.checkIfExpensesExists(userId))
      throw new NotFoundException('No se ha encontrado el gasto');
    try {
      //get account name and throw an error if the account does not exist
      const accountName: string = await this.getAccountName(id, userId);
      //get account document
      const accountDoc = await this.getAccountDocument(userId, accountName);
      //! ADD THE AMOUNT BACK TO THE ACCOUNT BALANCE
      // get the expesnses document of the user
      const expenseDoc = await this.expenseModel.findOne({
        userId: userId,
      });
      //get the index of the expense object inside the array of expenses
      const expenseIndex = expenseDoc.Expenses.findIndex(
        (exp) => exp['_id' as keyof object] == id,
      );
      if (expenseIndex == -1)
        throw new NotFoundException('No se ha encontrado el gasto');
      expenseDoc.Expenses.splice(expenseIndex, 1);
      await expenseDoc.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al eliminar el gasto reaizado ' + error.message,
      );
    }
  }
  /**
   * Adds the specified amount to the balance of the account with the given name.
   * @param accDoc The account document to update.
   * @param accName The name of the account to update.
   * @param amountToAdd The amount to add to the account balance.
   * @returns A Promise that resolves to true if the update was successful, or throws an InternalServerErrorException if an error occurred.
   */
  private async AddAmountToAccountBalance(
    accDoc: AccountDocument,
    accName: string,
    amountToAdd: number,
  ): Promise<boolean> {
    try {
      // find the index of the account object inside the array of accounts
      const accIndex: number = accDoc.Accounts.findIndex(
        (acc) => acc['accountName' as keyof object] == accName,
      );
      // add the amount to the account balance
      accDoc.Accounts[accIndex] = {
        ...accDoc.Accounts[accIndex],
        accountBalance: accDoc.Accounts[accIndex].accountBalance + amountToAdd,
      };
      // save the changes
      await accDoc.save();
      return true;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  /**
   * Checks if an account is of type 'saving'.
   * @param accDoc - The account document to search in.
   * @param accName - The name of the account to check.
   * @returns A boolean indicating whether the account is of type 'saving'.
   */
  private checkIfAccountIsSaving(
    accDoc: AccountDocument,
    accName: string,
  ): boolean {
    const accIndex: number = accDoc.Accounts.findIndex(
      (acc) => acc['accountName' as keyof object] == accName,
    );
    if (accDoc.Accounts[accIndex].accountType == 'saving') {
      return true;
    }
    return false;
  }
  /**
   * Reduces the account balance of a given account by a specified amount.
   * @param accDoc - The account document to update.
   * @param amount - The amount to reduce the account balance by.
   * @param accName - The name of the account to update.
   * @returns A Promise that resolves to a boolean indicating whether the operation was successful.
   * @throws An InternalServerErrorException if the account does not have enough money or if there is an error saving the changes.
   */
  private async reduceAccountAmount(
    accDoc: AccountDocument,
    amount: number,
    accName: string,
  ): Promise<boolean> {
    try {
      //fin the account object in the array of accounts
      const accIndex: number = accDoc.Accounts.findIndex(
        (acc) => acc['accountName' as keyof object] == accName,
      );
      //check if the accountBalance is greater than the amount
      if (accDoc.Accounts[accIndex].accountBalance < amount) {
        throw new InternalServerErrorException(
          'La cuenta no tiene suficiente dinero',
        );
      }
      //reduce the account balance by the amount
      accDoc.Accounts[accIndex] = {
        ...accDoc.Accounts[accIndex],
        accountBalance: accDoc.Accounts[accIndex].accountBalance - amount,
      };
      //save the changes
      await accDoc.save();
      return true;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Retrieves the name of an account given its ID and the user ID.
   * @param idAcc - The ID of the account to retrieve the name from.
   * @param userId - The ID of the user who owns the account.
   * @returns A Promise that resolves to the name of the account.
   * @throws NotFoundException if the account is not found.
   */
  private async getAccountName(idAcc: string, userId: string): Promise<string> {
    const accountDoc = await this.accountModel.findOne({
      userId: userId,
    });
    if (!accountDoc) {
      throw new NotFoundException(
        'No se ha encontrado la cuentas para el usuario',
      );
    }
    const accountItem = accountDoc.Accounts.find(
      (acc) => acc['_id' as keyof object] == idAcc,
    );
    if (!accountItem) {
      throw new NotFoundException('No se ha encontrado la cuenta');
    }
    return accountItem.accountName;
  }
  /**
   * Retrieves an account document from the database based on the provided user ID and account name.
   * @param userId The ID of the user associated with the account.
   * @param accountName The name of the account to retrieve.
   * @returns A Promise that resolves to an AccountDocument object.
   * @throws NotFoundException if no account document is found.
   */
  private async getAccountDocument(
    userId: string,
    accountName: string,
  ): Promise<AccountDocument> {
    const accountsDocument = await this.accountModel.findOne({
      userId: userId,
      'Accounts.accountName': accountName,
    });
    if (!accountsDocument) {
      throw new NotFoundException('No se ha encontrado la cuenta');
    }
    return accountsDocument;
  }
  /**
   * Checks if an account exists for a given user ID.
   * @param userId The ID of the user to check for an account.
   * @returns A Promise that resolves to a boolean indicating whether an account exists for the user.
   */
  private async checkIfExpensesExists(userId: string): Promise<boolean> {
    const expenseDoc = await this.expenseModel.findOne({ userId });
    if (!expenseDoc) {
      console.debug('no existe el documento');
      return false;
    }
    return true;
  }
}
