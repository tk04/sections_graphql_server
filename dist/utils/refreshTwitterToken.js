"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTwitterToken = void 0;
const axios_1 = __importDefault(require("axios"));
const refreshTwitterToken = async (user) => {
    const data = await (0, axios_1.default)({
        method: "POST",
        url: "https://api.twitter.com/2/oauth2/token",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: `refresh_token=${user.twitterAccessToken}&grant_type=refresh_token&client_id=${process.env.TWITTER_CLIENT_ID}`,
    });
    // fixed twitter oauth scope to get refresh_token
    // modify token in user database, and return new token.
};
exports.refreshTwitterToken = refreshTwitterToken;
