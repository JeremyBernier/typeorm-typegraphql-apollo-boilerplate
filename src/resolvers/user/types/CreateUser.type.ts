import { InputType } from "type-graphql";
import { Field } from "type-graphql";
import User from "../../../entity/User.entity";

@InputType()
export default class CreateUserInput implements Partial<User> {
  @Field((type) => String)
  username: string;

  @Field((type) => String)
  email: string;

  @Field((type) => String)
  password: string;
}
