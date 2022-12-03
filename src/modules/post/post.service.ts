import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { AppDataSource } from "../../data-source";
import Post from "../../entity/Post.entity";

const fields = new Set(Object.keys(new Post()));

export const getPosts = async () => {
  const postRepository = await AppDataSource.getRepository(Post);
  return postRepository.find();
};

export const getPost = async (id) => {
  const postRepository = await AppDataSource.getRepository(Post);
  return postRepository.findOne({
    where: {
      id,
    },
  });
};

export const createPost = async (input) => {
  for (const key in input) {
    if (!fields.has(key)) {
      throw new Error(`${key} is not a valid property`);
    }
  }

  const inputObj = plainToClass(Post, input);

  const errors = await validate(inputObj);
  if (errors?.length) {
    throw new Error(String(errors));
  }

  const postRepository = await AppDataSource.getRepository(Post);
  return postRepository.save(inputObj);
};
