export class UserLogedDto {
  userEmail: string;
  userToken: string;
  usertName: string;
  userLastName: string;
  userAge: number;
  constructor(
    userEmail: string,
    userToken: string,
    usertName: string,
    userLastName: string,
    userAge: number,
  ) {
    this.userEmail = userEmail;
    this.userToken = userToken;
    this.usertName = usertName;
    this.userLastName = userLastName;
    this.userAge = userAge;
  }
}
