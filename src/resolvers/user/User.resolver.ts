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
import * as argon2 from "argon2";
import { AppDataSource } from "../../data-source";
import User from "../../entity/User.entity";
import CreateUserInput from "./types/CreateUser.type";
import GetUserInput from "./types/GetUser.type";
import LoginInput from "./types/LoginInput.type";
import { loginUser } from "../../auth";
import { isValidEmail } from "../../lib/utils";
import ServerContext from "../../types/ServerContext";
import {
  validateGetUserInput,
  validateLoginInput,
  validateUsername,
} from "./validation";
import { getLoginWhereObj } from "./lib/helpers";

const BANNED_USERNAMES = new Set(["anonymous"]);

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

  @Query((returns) => User, { nullable: true })
  // @Authorized()
  async me(@Ctx() context: ServerContext) {
    const { session } = context;
    /** ensure password filtered out */

    if (session.userId == null) {
      return null;
    }

    const user = await this.userRepository.findOneBy({ id: session.userId });

    if (user == null) {
      throw new Error(
        "You appear to be logged in, but your account does not exist. Please contact administrator for assistance"
      );
    }

    return user;
  }

  @Mutation((returns) => User)
  async createUser(
    @Arg("input") { email, username, password: _password }: CreateUserInput
  ) {
    const usernameLowerCase = username?.toLowerCase();

    if (usernameLowerCase) {
      validateUsername(usernameLowerCase);

      if (usernameLowerCase.endsWith(".eth")) {
        throw new Error(
          `In order to get a .eth username, you must connect your eth wallet holding the corresponding ENS name, then our backend will verify that you own this ENS name and we can change your username`
        );
      }

      if (usernameLowerCase in BANNED_USERNAMES) {
        throw new Error(`Username already taken`);
      }
    }

    if (email?.length && !isValidEmail(email)) {
      throw new Error(`Email is invalid`);
    }

    const userWhere = [{ email }, { username: usernameLowerCase }].filter(
      (obj) => Object.values(obj)[0]
    );

    let userAlreadyExists = await this.userRepository.findOne({
      where: userWhere,
      select: ["id"],
    });

    if (userAlreadyExists) {
      throw new Error("Email or username is already in use");
    }

    const password = _password
      ? await argon2.hash(_password, { hashLength: 12 })
      : undefined;

    return this.userRepository.save({
      email,
      username: usernameLowerCase,
      password,
    });
  }

  @Mutation((returns) => User)
  async login(
    @Arg("input") input: LoginInput,
    @Ctx() { req, session, redis }: any
  ) {
    const { password } = input;
    validateLoginInput(input);

    const whereObj = getLoginWhereObj(input);

    // todo: logout of existing session
    const user = await this.userRepository.findOne({ where: whereObj });

    if (!user || user.password == null) {
      throw new Error("Invalid account or password");
    }

    const passwordValid = argon2.verify(user.password, password);
    if (!passwordValid) {
      throw new Error("Invalid account or password");
    }

    await loginUser(req, user);
    return user;
  }
}
