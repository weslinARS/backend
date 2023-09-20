import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/Dto/create-User.dto';
import { UserCredentials } from 'src/Schemas/UserCredentials.schema';
import { UserInfo } from 'src/Schemas/UserInfo.schema';
import { CreateUserCredentialsDto, UserLogedDto } from '../Dto';
@Injectable()
export class UserCredentialsService {
  constructor(
    @InjectModel(UserCredentials.name)
    private userCModel: Model<UserCredentials>,
    @InjectModel(UserInfo.name)
    private userInfoModel: Model<UserInfo>,
    private jwtService: JwtService,
  ) {}
  async logIn(userCred: CreateUserCredentialsDto): Promise<UserLogedDto> {
    try {
      // !check if user exists
      const user = await this.userCModel.findOne({
        userEmail: userCred.userEmail,
      });
      if (!user) {
        throw new BadRequestException('No existe el usuario');
      }
      // !compare passwords
      const isValidPassword = await bcrypt.compare(
        userCred.userPassword,
        user.userPassword,
      );
      if (!isValidPassword)
        throw new BadRequestException('Contraseña incorrecta');
      // !get the user information
      const userInfo = await this.userInfoModel.findOne({
        id: user._id,
      });
      // !generate token
      const payload = { _id: user._id };
      const token = this.jwtService.sign(payload);
      return new UserLogedDto(
        userInfo.userEmail,
        token,
        userInfo.userName,
        userInfo.userLastName,
        userInfo.userAge,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async signUp(userInfoDto: CreateUserDto): Promise<UserInfo> {
    if ((await this.checkIfUserExists(userInfoDto.userEmail)) == false) {
      // !if user does not exist, create user
      // generate salts
      const salt = await bcrypt.genSalt(10);
      try {
        //hash password
        const hashedPassWord = await bcrypt.hash(
          userInfoDto.userPassword,
          salt,
        );
        //!create userCredentials
        const userCredentials = await this.userCModel.create({
          userEmail: userInfoDto.userEmail,
          userPassword: hashedPassWord,
        });
        console.debug(userCredentials);
        //!create userInfo
        const userCreated = await this.userInfoModel.create({
          id: userCredentials._id,
          userAge: userInfoDto.userAge,
          userLastName: userInfoDto.userLastName,
          userName: userInfoDto.userName,
          userEmail: userInfoDto.userEmail,
        });
        return userCreated;
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  /**
   * function to check if user exists
   * @param userEmail email to check if exists
   * @returns true if exists, false if not
   */
  private async checkIfUserExists(userEmail: string) {
    const userEmailExist = this.userCModel.findOne({
      userEmail,
    });
    return !userEmailExist ? true : false;
  }
}
