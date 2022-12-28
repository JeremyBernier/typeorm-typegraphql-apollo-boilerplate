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
import ServerContext from "../../types/ServerContext";
import CreatePostInput from "./types/CreatePost.type";
import UpdatePostInput from "./types/UpdatePost.type";

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
  async post(@Arg("id", (type) => String) id: string) {
    return this.postRepository.findOne({
      where: {
        id,
      },
    });
  }

  @Mutation((returns) => Post)
  async createPost(
    @Arg("input") input: CreatePostInput,
    @Ctx() { session }: ServerContext
  ) {
    return this.postRepository.save({
      ...input,
    });
  }

  @Mutation((returns) => Post)
  async updatePost(
    @Arg("input") input: UpdatePostInput,
    @Ctx() { session }: ServerContext
  ) {
    // const userId = session.userId;

    let post = await this.postRepository.findOne({
      where: { id: input.id },
    });

    if (post?.id == null) {
      throw new Error("Post does not exist");
    }

    // if (userId != post.userId) {
    //   throw new Error("You do not have permission to update this");
    // }

    return this.postRepository.save({
      ...input,
    });
  }
}
