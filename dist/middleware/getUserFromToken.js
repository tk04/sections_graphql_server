"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFromToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getUserFromToken = async (token, prisma) => {
    try {
        const userId = jsonwebtoken_1.default.decode(token)
            .userId;
        const user = await prisma.user.findFirst({
            where: { id: userId },
        });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    catch (e) {
        console.log("USER NOT LOGGED IN");
    }
};
exports.getUserFromToken = getUserFromToken;
