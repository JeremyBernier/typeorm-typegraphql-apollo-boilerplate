import path from "path";
import { config } from "dotenv";
const isProduction = process.env.NODE_ENV === "production";
const envFile = isProduction ? ".env.production" : ".env";
// Import Env Vars
config({
  path: path.resolve(process.cwd(), envFile),
  debug: true,
});
import Post from "./src/entity/Post.entity";
import { AppDataSource } from "./src/data-source";
import { createDbConnection } from "./src/db";

const init = async () => {
  const dbConnection = await createDbConnection();
  const postRepository = await AppDataSource.getRepository(Post);
  // const res = await postRepository.find();

  return postRepository.delete("0a08e488-1609-4edb-b711-5613102158bc");
  // return postRepository.delete({ id: "0a08e488-1609-4edb-b711-5613102158bc" });
  // console.log(res);
};

init();
