import * as dotenv from "dotenv";
dotenv.config();
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
import path from "path";
import bodyParser from "body-parser";
import { createDbConnection } from "./db/index";
import { isProduction, corsOptions } from "./config";
import redis from "./redis";
import ServerContext from "./types/ServerContext";
import cookieParser from "cookie-parser";

const resolverPaths = "/resolvers/**/*.resolver.{ts,js}";

if (!process.env.EXPRESS_SESSION_SECRET) {
  console.info("EXPRESS_SESSION_SECRET is required.");
  process.exit();
}

export const createServer = async () => {
  const dbConnection = await createDbConnection();

  const app = express().use(cookieParser()).use(cors(corsOptions));

  const RedisStore = connectRedis(session as any);

  // const sess = {
  //   secret: "keyboard cat",
  //   cookie: {} as any,
  // };

  // if (app.get("env") === "production") {
  //   app.set("trust proxy", 1); // trust first proxy
  //   sess.cookie.secure = true; // serve secure cookies
  // }

  // app.use(session(sess));

  const sessionHandler = session({
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
  });
  app.use(sessionHandler);

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
        // token: req.headers.token,
        // req,
        session: req.session,
        // redis,
      }),
    })
  );

  return httpServer;
};
