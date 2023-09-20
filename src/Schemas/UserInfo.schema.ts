import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
@Schema()
export class UserInfo {
  @Prop({
    unique: true,
    required: true,
  })
  userEmail: string;
  @Prop({
    required: true,
  })
  userName: string;
  @Prop({
    required: true,
  })
  userLastName: string;
  @Prop({
    required: true,
  })
  userAge: number;
  @Prop({
    required: true,
    unique: true,
  })
  id: ObjectId;
}
export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);
