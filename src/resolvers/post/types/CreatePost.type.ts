import { InputType } from "type-graphql";
import { Field } from "type-graphql";

@InputType()
export default class CreatePostInput {
  @Field((type) => String)
  title: string;

  @Field((type) => String)
  content: number;
}
