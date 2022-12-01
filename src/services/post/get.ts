import { AppDataSource } from "../../data-source";
import Post from "../../entity/Post.entity";

export const getPosts = async () => {
  const postRepository = await AppDataSource.getRepository(Post);
  return postRepository.find();
};
