import { InputType } from "type-graphql";
import { Field } from "type-graphql";
import Post from "../../../entity/Post.entity";

@InputType()
export default class CreatePostInput implements Partial<Post> {
  @Field((type) => String)
  title: string;

  @Field((type) => String)
  content: string;
}
