import { GraphQLError } from "graphql";

export const validateGetUserInput = (input) => {
  if (!Object.values(input).filter((val) => val != null).length) {
    throw new GraphQLError(`Input cannot be empty`, {
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  }
};

export const validateLoginInput = (input) => {
  const { email, username, usernameOrEmail } = input;
  if (!email?.length && !username?.length && !usernameOrEmail?.length) {
    throw new GraphQLError(`Must specifiy username or email`, {
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  }
};

const USERNAME_MIN_LENGTH = 3;

export const validateUsername = (username: string) => {
  if (username.length < USERNAME_MIN_LENGTH) {
    throw new Error(
      `Username must be longer than ${USERNAME_MIN_LENGTH} characters`
    );
  }
  if (/[^a-zA-Z0-9_]/.test(username)) {
    throw new Error(`Username cannot have special characters`);
  }
};
