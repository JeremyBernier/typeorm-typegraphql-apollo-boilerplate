import { GraphQLError } from "graphql";

export const getLoginWhereObj = (input) => {
  const { email, username, usernameOrEmail } = input;
  const whereObj = email?.length ? { email } : { username };

  if (usernameOrEmail && !email && !username) {
    if (usernameOrEmail.includes("@")) {
      whereObj.email = usernameOrEmail;
    } else {
      whereObj.username = usernameOrEmail;
    }
  } else if (email) {
    whereObj.email = email;
  } else if (username) {
    whereObj.username = username;
  } else {
    throw new GraphQLError(`Must specifiy username or email`, {
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  }
  return whereObj;
};
