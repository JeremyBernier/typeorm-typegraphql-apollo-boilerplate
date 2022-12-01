import { InputType, Int } from "type-graphql";
import { Field } from "type-graphql";
import User from "../../../entity/User.entity";

@InputType()
export default class GetUserInput implements Partial<User> {
  @Field((type) => String, { nullable: true })
  id?: string;

  @Field((type) => String, { nullable: true })
  username?: string;

  @Field((type) => String, { nullable: true })
  email?: string;
}
