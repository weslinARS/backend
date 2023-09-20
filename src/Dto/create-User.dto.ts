export class CreateUserDto {
  userEmail: string;
  userPassword: string;
  userName: string;
  userLastName: string;
  userAge: number;
  constructor(
    userEmail: string,
    userPassword: string,
    userName: string,
    userLastName: string,
  ) {
    this.userEmail = userEmail;
    this.userPassword = userPassword;
    this.userName = userName;
    this.userLastName = userLastName;
  }
}
