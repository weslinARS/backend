export class CreateAccountDto {
  accountName: string;
  accounType: string;
  accountBalance?: number;
  accountCurrency?: string;
  IncludedInBalance?: boolean;
  accountCutOffDate?: number;
  accountDeadlineDate?: number;
  accountLimit?: number;
}
