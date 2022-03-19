import { RedisClientType } from "@node-redis/client";
import { PrismaClient } from "@prisma/client";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
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

  app.set("trust proxy", true);

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
  });

  app.listen(process.env.PORT || 4000);
};

main();
