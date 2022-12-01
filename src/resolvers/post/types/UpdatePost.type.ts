import { InputType } from "type-graphql";
import { Field } from "type-graphql";
import Post from "../../../entity/Post.entity";

@InputType()
export default class UpdatePostInput implements Partial<Post> {
  @Field((type) => String)
  id: string;

  @Field((type) => String, { nullable: true })
  title?: string;

  @Field((type) => String, { nullable: true })
  content?: string;
}
