import { InputType } from "type-graphql";
import User from "../../../entity/User.entity";
import { Field } from "type-graphql";
import { IsEmail, MinLength, MaxLength, IsString } from "class-validator";

@InputType()
export default class LoginInput implements Partial<User> {
  @Field({ nullable: true })
  // @IsEmail()
  @IsString()
  email: string;

  @Field({ nullable: true })
  @IsString()
  // @MinLength(2)
  // @MaxLength(255)
  username: string;

  @Field({ nullable: true })
  @IsString()
  @MinLength(2)
  usernameOrEmail?: string;

  @Field()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;
}
