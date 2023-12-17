import { ApiProperty } from '@nestjs/swagger';

interface ICreateUserCredentialsDto {
  userEmail: string;
  userPassword: string;
}
export class CreateUserCredentialsDto implements ICreateUserCredentialsDto {
  @ApiProperty()
  userEmail: string;
  @ApiProperty()
  userPassword: string;
  constructor(userEmail: string, userPassword: string) {
    this.userEmail = userEmail;
    this.userPassword = userPassword;
  }
}
