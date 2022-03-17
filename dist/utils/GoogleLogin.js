"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleLogin = void 0;
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const GoogleLogin = async (code, prisma) => {
    const data = await (0, axios_1.default)({
        url: "https://oauth2.googleapis.com/token",
        method: "POST",
        data: `code=${code}&client_id=${process.env.GOOGLE_CLIENT_ID}&client_secret=${process.env.GOOGLE_CLIENT_SECRET}&redirect_uri=${process.env.NODE_ENV == "production"
            ? "https://sections1.vercel.app/cb"
            : "http://localhost:3000/cb"}&grant_type=authorization_code`,
    }).catch((e) => console.log(e));
    let user;
    if (data && data.data && data.data.id_token) {
        const { id_token } = data.data;
        const token_data = jsonwebtoken_1.default.decode(id_token);
        user = await prisma.user.findFirst({
            where: {
                googleId: token_data.sub,
            },
        });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: token_data.name,
                    email: token_data.email,
                    picture: token_data.picture,
                    googleId: token_data.sub,
                },
            });
        }
        return user;
    }
    else {
        throw new Error("Could not authennticate with Google");
    }
};
exports.GoogleLogin = GoogleLogin;
