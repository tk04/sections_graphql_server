"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const argon2_1 = __importDefault(require("argon2"));
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const type_graphql_1 = require("type-graphql");
const user_1 = require("../entities/user");
const auth_1 = require("../middleware/auth");
const GoogleLogin_1 = require("../utils/GoogleLogin");
const setToken_1 = require("../utils/setToken");
const TwitterLogin_1 = require("../utils/TwitterLogin");
let SignupInput = class SignupInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], SignupInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], SignupInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], SignupInput.prototype, "password", void 0);
SignupInput = __decorate([
    (0, type_graphql_1.InputType)()
], SignupInput);
let updateInput = class updateInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], updateInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], updateInput.prototype, "email", void 0);
updateInput = __decorate([
    (0, type_graphql_1.InputType)()
], updateInput);
let LoginInput = class LoginInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], LoginInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], LoginInput.prototype, "password", void 0);
LoginInput = __decorate([
    (0, type_graphql_1.InputType)()
], LoginInput);
let UserError = class UserError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserError.prototype, "path", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserError.prototype, "message", void 0);
UserError = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserError);
let FullUser = class FullUser extends user_1.User {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], FullUser.prototype, "twitter", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], FullUser.prototype, "google", void 0);
FullUser = __decorate([
    (0, type_graphql_1.ObjectType)()
], FullUser);
const UserResponse = (0, type_graphql_1.createUnionType)({
    name: "UserResponse",
    types: () => [FullUser, UserError],
    resolveType: (value) => {
        if ("email" in value || "name" in value)
            return FullUser;
        if ("path" in value)
            return UserError;
    },
});
let UserResolver = class UserResolver {
    hello() {
        return "Hello World";
    }
    async me({ req, prisma }) {
        const token = req.cookies.token;
        if (token) {
            const { userId } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = await prisma.user.findFirst({
                where: {
                    id: userId,
                },
            });
            // response.google = !!user.googleId;
            if (user) {
                const response = {
                    ...user,
                    twitter: !!user.twitterId,
                    google: !!user.googleId,
                };
                return response;
            }
            else {
                return null;
            }
        }
    }
    async updateMe({ prisma, req }, input) {
        try {
            const user = await prisma.user.update({
                where: { id: req.user.id },
                data: input,
            });
            const response = {
                ...user,
                twitter: !!user.twitterId,
                google: !!user.googleId,
            };
            return response;
        }
        catch (e) {
            return {
                path: "update",
                message: "Could not update user",
            };
        }
    }
    async signup(input, { prisma, res }) {
        try {
            const user = await prisma.user.create({
                data: {
                    name: input.name,
                    email: input.email.toLowerCase(),
                    password: await argon2_1.default.hash(input.password),
                },
            });
            (0, setToken_1.setToken)(user.id, res);
            return user;
        }
        catch (e) {
            return {
                path: "email",
                message: "Email already in use: try a different email",
            };
        }
    }
    async login(input, { res, prisma }) {
        try {
            const user = await prisma.user.findFirst({
                where: { email: input.email.toLowerCase() },
            });
            if (!user) {
                throw new Error("User not found");
            }
            if (user.password) {
                const valid = await argon2_1.default.verify(user.password, input.password);
                if (!valid) {
                    throw new Error("Could not login user");
                }
                else {
                    (0, setToken_1.setToken)(user.id, res);
                    const response = {
                        ...user,
                        twitter: !!user.twitterId,
                        google: !!user.googleId,
                    };
                    return response;
                }
            }
            else {
                throw new Error("Could not login user");
            }
        }
        catch (e) {
            return {
                path: "login",
                message: "Could not login user",
            };
        }
    }
    async signInWithGoogle(code, { prisma, res }) {
        try {
            const user = await (0, GoogleLogin_1.GoogleLogin)(code, prisma);
            (0, setToken_1.setToken)(user.id, res);
            const response = {
                ...user,
                twitter: !!user.twitterId,
                google: !!user.googleId,
            };
            return response;
        }
        catch (e) {
            return {
                path: "Google Login",
                message: "Could not authenticate with Google",
            };
        }
    }
    async signInWithTwitter(code, { prisma, res }) {
        try {
            const user = await (0, TwitterLogin_1.TwitterLogin)(code, prisma).catch((e) => {
                throw new Error(e.message);
            });
            (0, setToken_1.setToken)(user.id, res);
            if (user) {
                const response = {
                    ...user,
                    twitter: !!user.twitterId,
                    google: !!user.googleId,
                };
                return response;
            }
            else {
                throw new Error("user not found");
            }
        }
        catch (e) {
            return {
                path: "Twitter Login",
                message: "Could not authenticate with Twitter",
            };
        }
    }
    logout({ res }) {
        res.clearCookie("token", {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            domain: process.env.NODE_ENV === "production"
                ? "sections1.vercel.app"
                : undefined,
        });
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "hello", null);
__decorate([
    (0, type_graphql_1.Query)(() => FullUser, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    (0, type_graphql_1.UseMiddleware)(auth_1.auth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, updateInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateMe", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("input", () => SignupInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SignupInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "signup", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("input", () => LoginInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("code", () => String)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "signInWithGoogle", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("code", () => String)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "signInWithTwitter", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "logout", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)(user_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
