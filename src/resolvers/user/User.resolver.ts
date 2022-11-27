import {
  Authorized,
  Resolver,
  Mutation,
  Arg,
  FieldResolver,
  Query,
  Ctx,
  Root,
} from "type-graphql";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import User from "../../entity/User.entity";
import CreateUserInput from "./types/CreateUser.type";
import GetUserInput from "./types/GetUser.type";
import { GraphQLError } from "graphql";

const validateGetUserInput = (input) => {
  if (!Object.values(input).filter((val) => val != null).length) {
    throw new GraphQLError(`Input cannot be empty`, {
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  }
};

@Resolver(User)
export default class UserResolver {
  constructor(private readonly userRepository: Repository<User>) {
    this.userRepository = AppDataSource.getRepository(User);
  }

  @Query(() => [User])
  async users() {
    return this.userRepository.find();
  }

  @Query(() => User, { nullable: true })
  async user(@Arg("input") input: GetUserInput) {
    validateGetUserInput(input);
    return this.userRepository.findOne({ where: { ...input } });
  }

  @Mutation(() => User)
  async createUser(@Arg("input") input: CreateUserInput) {
    return this.userRepository.save({
      ...input,
    });
  }
}
