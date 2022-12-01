import path from "path";
import { config } from "dotenv";
const isProduction = process.env.NODE_ENV === "production";
const envFile = isProduction ? ".env.production" : ".env";
// Import Env Vars
config({
  path: path.resolve(process.cwd(), envFile),
  debug: true,
});
import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { createDbConnection } from "./db/index";
import { corsOptions } from "./config";
import redis from "./redis";
import ServerContext from "./types/ServerContext";

const resolverPaths = "/resolvers/**/*.resolver.{ts,js}";

if (!process.env.EXPRESS_SESSION_SECRET) {
  console.info("EXPRESS_SESSION_SECRET is required.");
  process.exit();
}

export const createServer = async () => {
  const dbConnection = await createDbConnection();

  const app = express();
  app.use(cors(corsOptions));

  const RedisStore = connectRedis(session as any);

  const sessionObj = {
    store: new RedisStore({ client: redis }),
    secret: process.env.EXPRESS_SESSION_SECRET as string,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 Week
      secure: isProduction,
      sameSite: isProduction && "none",
      domain: isProduction ? `.${process.env.DOMAIN_HOST}` : undefined,
    },
    name: process.env.COOKIE_NAME,
    proxy: isProduction,
    resave: false,
    saveUninitialized: false,
  };
  app.use(session(sessionObj));

  app.get("/blah", (req, res) => {
    if (req.session.views) {
      req.session.views++;
      res.setHeader("Content-Type", "text/html");
      res.write("<p>views: " + req.session.views + "</p>");
      res.write("<p>expires in: " + req.session.cookie.maxAge / 1000 + "s</p>");
      res.end();
    } else {
      req.session.views = 1;
      res.end("welcome to the session demo. refresh!");
    }
  });

  const httpServer = http.createServer(app);

  const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
    resolvers: [path.join(__dirname, resolverPaths)],
  });

  const server = new ApolloServer<ServerContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }: any) => ({
        req,
        session: req.session,
      }),
    })
  );

  return httpServer;
};
