import { RedisClientType } from "@node-redis/client";
import { PrismaClient } from "@prisma/client";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { createClient } from "redis";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { TweetResolver } from "./resolvers/Tweet";
import { UserResolver } from "./resolvers/User";

const main = async () => {
  const app = express();

  const redis: RedisClientType = createClient({
    url: process.env.REDIS_URI,
    password: process.env.REDIS_PASS,
  });
  await redis.connect();

  app.use(cookieParser(process.env.JWT_SECRET));
  app.use(
    cors({
      origin:
        process.env.NODE_ENV == "production"
          ? "sections-be.herokuapp.com"
          : "http://localhost:3000",
      credentials: true,
    })
  );
  app.set("trust proxy", true);
  // app.use((req, res, next) => {
  //   res.setHeader("Access-Control-Allow-Credentials", "true");
  //   res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  //   res.setHeader("Access-Control-Allow-Headers", "Content-Type, *");
  //   next();
  // });
  const prisma = new PrismaClient();
  const apolloServer = new ApolloServer({
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    schema: await buildSchema({ resolvers: [UserResolver, TweetResolver] }),
    context: ({ req, res }) => ({ req, res, prisma, redis }),
    introspection: true,
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: {
      origin:
        process.env.NODE_ENV == "production"
          ? "https://sections1.vercel.app"
          : "http://localhost:3000",
      credentials: true,
    },
  });

  app.listen(process.env.PORT || 4000);
};

main();
