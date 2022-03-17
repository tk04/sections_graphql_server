import "reflect-metadata";
import { buildSchema } from "type-graphql";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { UserResolver } from "./resolvers/User";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import { TweetResolver } from "./resolvers/Tweet";

import { createClient } from "redis";
import { RedisClientType } from "@node-redis/client";
const main = async () => {
  const app = express();

  const redis: RedisClientType = createClient({
    url: process.env.REDIS_URI,
    password: process.env.REDIS_PASS,
  });
  await redis.connect();

  app.use(cookieParser(process.env.JWT_SECRET));
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  const prisma = new PrismaClient();
  const apolloServer = new ApolloServer({
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    schema: await buildSchema({ resolvers: [UserResolver, TweetResolver] }),
    context: ({ req, res }) => ({ req, res, prisma, redis }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: { origin: "http://localhost:3000", credentials: true },
  });
  app.listen(process.env.PORT || 4000);
};

main();
