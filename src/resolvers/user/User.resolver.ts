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

@Resolver(User)
export default class UserResolver {
  constructor(private readonly userRepository: Repository<User>) {
    this.userRepository = AppDataSource.getRepository(User);
  }

  @Query(() => [User])
  async users() {
    return this.userRepository.find();
  }

  @Mutation(() => User)
  async createUser(@Arg("input") input: CreateUserInput): Promise<User> {
    return this.userRepository.save({
      ...input,
    });
  }
}
