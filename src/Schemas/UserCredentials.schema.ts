import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserCredentials {
  @Prop({
    unique: true,
    required: true,
  })
  userEmail: string;
  @Prop({
    required: true,
  })
  userPassword: string;
}

export const UserCredSchema = SchemaFactory.createForClass(UserCredentials);
