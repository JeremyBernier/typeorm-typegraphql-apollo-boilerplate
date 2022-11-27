import * as dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import { createDbConnection } from "./db/index";
// import { typeDefs, resolvers } from "./schema";

const resolverPaths = "/resolvers/**/*.resolver.{ts,js}";

interface MyContext {
  token?: String;
}

const init = async () => {
  const dbConnection = await createDbConnection();

  const app = express();
  const httpServer = http.createServer(app);

  const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
    resolvers: [path.join(__dirname, resolverPaths)],
  });

  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    // formatError: (formattedError, error) => {
    //   console.log("donkey");
    //   console.error("[GraphQL Error]: " + formattedError);
    //   // console.error(
    //   //   "[GraphQL Error]: " + JSON.stringify(formattedError, null, 2)
    //   // );
    //   return formattedError;
    //   // // Return a different error message
    //   // if (
    //   //   formattedError.extensions.code ===
    //   //   ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
    //   // ) {
    //   //   return {
    //   //     ...formattedError,
    //   //     message:
    //   //       "Your query doesn't match the schema. Try double-checking it!",
    //   //   };
    //   // }

    //   // // Otherwise return the formatted error. This error can also
    //   // // be manipulated in other ways, as long as it's returned.
    //   // return formattedError;
    // },
  });

  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
};

init();
