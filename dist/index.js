"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const apollo_server_core_1 = require("apollo-server-core");
const apollo_server_express_1 = require("apollo-server-express");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const Tweet_1 = require("./resolvers/Tweet");
const User_1 = require("./resolvers/User");
const main = async () => {
    const app = (0, express_1.default)();
    const redis = (0, redis_1.createClient)({
        url: process.env.REDIS_URI,
        password: process.env.REDIS_PASS,
    });
    await redis.connect();
    app.use((0, cookie_parser_1.default)(process.env.JWT_SECRET));
    app.set("trust proxy", true);
    const prisma = new client_1.PrismaClient();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        plugins: [(0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)()],
        schema: await (0, type_graphql_1.buildSchema)({ resolvers: [User_1.UserResolver, Tweet_1.TweetResolver] }),
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
