"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = async ({ context }, next) => {
    const { prisma, req } = context;
    const token = req.cookies.token;
    console.log("cookies: ", req.cookies);
    if (token) {
        try {
            const userId = jsonwebtoken_1.default.decode(token)
                .userId;
            const user = await prisma.user.findFirst({
                where: { id: userId },
            });
            if (!user) {
                throw new Error("User not found");
            }
            // console.log("USER: ", user);
            req.user = user;
            return next();
        }
        catch (e) {
            console.log("USER NOT LOGGED IN");
        }
    }
};
exports.auth = auth;
