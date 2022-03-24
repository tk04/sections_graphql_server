"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTweetsHelper = void 0;
const axios_1 = __importDefault(require("axios"));
// const getTweets = async (tweets: Tweets[]) => {
//   const result = await Promise.all(
//     tweets.map(async (tweet) => {
//       const { data } = await axios.get(
//         `https://api.twitter.com/1.1/statuses/show.json?id=${tweet.tweetId}&tweet_mode=extended`
//       );
//       return data;
//     })
//   );
//   return result;
// };
const getTweetsHelper = async (tweets, redis, prisma) => {
    try {
        const access_token = process.env.TWITTER_ACCESS_TOKEN;
        // let results: Tweet[] = new Array();
        const results = await Promise.all(tweets.map(async (val) => {
            var _a, _b;
            const url = val.tweet.split("status/")[1].split("?")[0];
            const inCache = await redis.get(`tweet:${url}`);
            if (inCache) {
                // cache hits
                return JSON.parse(inCache);
            }
            const tweetRes = await (0, axios_1.default)({
                method: "GET",
                url: `https://api.twitter.com/2/tweets/${url}?expansions=attachments.poll_ids,attachments.media_keys,author_id&user.fields=profile_image_url,verified&tweet.fields=public_metrics&media.fields=url,preview_image_url`,
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            if (!tweetRes.data.errors) {
                const pollOptions = ((_a = tweetRes.data.includes) === null || _a === void 0 ? void 0 : _a.polls) &&
                    ((_b = tweetRes.data.includes) === null || _b === void 0 ? void 0 : _b.polls[0].options);
                const tweet = tweetRes.data.data;
                const { text, id, public_metrics: { like_count: likes, retweet_count: retweets, reply_count: replies, }, } = tweet;
                // console.log("TWEET: ", tweet);
                const user = tweetRes.data.includes.users[0];
                const response = {
                    url: val.tweet.split("?")[0],
                    text,
                    id,
                    likes,
                    user,
                    retweets,
                    replies,
                    pollOptions,
                    media: tweetRes.data.includes.media,
                };
                redis.set(`tweet:${url}`, JSON.stringify(response));
                redis.expire(`tweet:${url}`, 60 * 60 * 24 * 5); // 5 days
                return response;
            }
            else {
                // delete tweet from db if it is not found (tweet deleted)
                await prisma.tweets.delete({ where: { id: val.id } });
                return null;
            }
        }));
        return results;
    }
    catch (e) {
        console.log("ERROR: ", e);
        return null;
    }
};
exports.getTweetsHelper = getTweetsHelper;
