import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { AppDataSource } from "../../data-source";
import Post from "../../entity/Post.entity";

const fields = new Set(Object.keys(new Post()));

const parseQueryBuilderInsert = (res) => res?.generatedMaps?.[0];

interface GetPostsQuery {
  include_drafts?: boolean;
}

export const getPosts = async (getPostsQuery: GetPostsQuery) => {
  const postRepository = await AppDataSource.getRepository(Post);
  return postRepository.find({
    order: {
      createdAt: "desc",
    },
    where: {
      ...(getPostsQuery?.include_drafts == null && { public: true }),
    },
  });
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

  const res = await AppDataSource.createQueryBuilder()
    .insert()
    .into(Post)
    .values(input)
    .returning("*")
    .execute();

  return parseQueryBuilderInsert(res);
};

export const updatePost = async (input) => {
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

export const deletePost = async (input: { id: string }) => {
  const postRepository = await AppDataSource.getRepository(Post);
  return postRepository.delete(input.id);
};
