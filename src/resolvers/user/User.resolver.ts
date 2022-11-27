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

@Resolver(User)
export default class UserResolver {
  @Query(() => String)
  async hello() {
    return "world";
  }

  constructor(private readonly userRepository: Repository<User>) {
    this.userRepository = AppDataSource.getRepository(User);
  }

  @Query(() => [User])
  async users() {
    return this.userRepository.find();
  }

  @Query(() => String)
  async blah() {
    return "blah";
  }
}
