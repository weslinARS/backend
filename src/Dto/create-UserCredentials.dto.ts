interface ICreateUserCredentialsDto {
  userEmail: string;
  userPassword: string;
}
export class CreateUserCredentialsDto implements ICreateUserCredentialsDto {
  userEmail: string;
  userPassword: string;
  constructor(userEmail: string, userPassword: string) {
    this.userEmail = userEmail;
    this.userPassword = userPassword;
  }
}
