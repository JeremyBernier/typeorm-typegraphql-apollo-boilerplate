import * as dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import { createDbConnection } from "./db/index";

const resolverPaths = "/resolvers/**/*.resolver.{ts,js}";

interface MyContext {
  token?: String;
}

export const createServer = async () => {
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
    formatError: (formattedError, error) => {
      console.log("formattedError", formattedError, error);
      // Don't give the specific errors to the client.
      // if (unwrapResolverError(error) instanceof CustomDBError) {
      //   return { message: 'Internal server error' };
      // }

      // Strip `Validation: ` prefix and use `extensions.code` instead
      if (formattedError.message.startsWith("Validation:")) {
        return {
          ...formattedError,
          message: formattedError.message.replace(/^Validation: /, ""),
          extensions: { ...formattedError?.extensions, code: "VALIDATION" },
        };
      }

      // Otherwise, return the original error. The error can also
      // be manipulated in other ways, as long as it's returned.
      return formattedError;
    },
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

  return httpServer;
};
