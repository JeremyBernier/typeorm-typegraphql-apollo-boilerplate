import {
  Authorized,
  Resolver,
  Mutation,
  Arg,
  FieldResolver,
  Query,
  Ctx,
  Root,
  Int,
} from "type-graphql";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import Post from "../../entity/Post.entity";
import CreatePostInput from "./types/CreatePost.type";

@Resolver(Post)
export default class PostResolver {
  constructor(private readonly postRepository: Repository<Post>) {
    this.postRepository = AppDataSource.getRepository(Post);
  }

  @Query(() => [Post])
  async posts() {
    return this.postRepository.find();
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("id", (type) => Int) id: number) {
    return this.postRepository.findOne({
      where: {
        id,
      },
    });
  }

  // @Mutation(() => Post)
  // async createUser(@Arg("input") input: CreatePostInput) {
  //   return this.postRepository.save({
  //     ...input,
  //   });
  // }
}
