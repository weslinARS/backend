import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty()
  userEmail: string;
  @ApiProperty()
  userPassword: string;
  @ApiProperty()
  userName: string;
  @ApiProperty()
  userLastName: string;
  @ApiProperty()
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
