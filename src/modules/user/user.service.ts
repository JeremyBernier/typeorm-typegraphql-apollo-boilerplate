import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { AppDataSource } from "../../data-source";
import User from "../../entity/User.entity";

const fields = new Set(Object.keys(new User()));

export const getUsers = async () => {
  const userRepository = await AppDataSource.getRepository(User);
  return userRepository.find();
};

export const getUser = async (id) => {
  const userRepository = await AppDataSource.getRepository(User);
  return userRepository.findOne({
    where: {
      id,
    },
  });
};

export const createUser = async (input) => {
  for (const key in input) {
    if (!fields.has(key)) {
      throw new Error(`${key} is not a valid property`);
    }
  }

  const inputObj = plainToClass(User, input);

  const errors = await validate(inputObj);
  if (errors?.length) {
    throw new Error(String(errors));
  }

  const userRepository = await AppDataSource.getRepository(User);
  return userRepository.save({
    ...input,
  });
};
