import { validate } from "class-validator";
// import pick from 'lodash/pick';
import { AppDataSource } from "../../data-source";
import Post from "../../entity/Post.entity";

const POST_INPUT_FIELDS = ["title", "content"];

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
  // validate(post)
  // const post = new Post();
  // Object.keys(input).map((key) => {
  //   post[key] = input[key];
  // });
  const post = new Post();
  // post.content = "Yes";
  post.title = "Blah";
  const res = await validate(post, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  console.log("validate", res);
  // const obj = pick(input,)

  const postRepository = await AppDataSource.getRepository(Post);
  return postRepository.save({
    ...input,
  });
};
