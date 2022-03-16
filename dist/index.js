"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const apollo_server_core_1 = require("apollo-server-core");
const User_1 = require("./resolvers/User");
const client_1 = require("@prisma/client");
require("dotenv/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const Tweet_1 = require("./resolvers/Tweet");
const ioredis_1 = __importDefault(require("ioredis"));
const main = async () => {
    const app = (0, express_1.default)();
    const redis = new ioredis_1.default();
    app.use((0, cookie_parser_1.default)(process.env.JWT_SECRET));
    app.use((0, cors_1.default)({ origin: "http://localhost:3000", credentials: true }));
    const prisma = new client_1.PrismaClient();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        plugins: [(0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)()],
        schema: await (0, type_graphql_1.buildSchema)({ resolvers: [User_1.UserResolver, Tweet_1.TweetResolver] }),
        context: ({ req, res }) => ({ req, res, prisma, redis }),
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: { origin: "http://localhost:3000", credentials: true },
    });
    app.listen(4000);
};
main();
