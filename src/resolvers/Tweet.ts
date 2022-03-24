import axios from "axios";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Tweet } from "../entities/Tweet";
import { auth } from "../middleware/auth";
import { context } from "../types/types";
import { getTweetsHelper } from "../utils/getTweets";
export type TweetsCreateManyInput = {
  id?: string;
  userId: string;
  tweet: string;
};
@InputType()
class TweetInput {
  @Field()
  tweet: string;
  @Field(() => String, { nullable: true })
  userId?: string;
}

@Resolver()
export class TweetResolver {
  @Query(() => [Tweet], { nullable: true })
  @UseMiddleware(auth)
  async getMyTweets(@Ctx() { req, prisma, redis }: context) {
    try {
      const tweets = await prisma.tweets.findMany({
        where: { userId: req.user!.id },
      });

      const result = await getTweetsHelper(tweets, redis, prisma);

      return result?.filter((tweet) => tweet !== null); // return only tweets that are not null (i.e. not deleted);
    } catch (e) {
      console.log("ERROR: ", e);
      return null;
    }
  }
  @Query(() => [Tweet], { nullable: true })
  async getTweets(@Ctx() { prisma, redis }: context, @Arg("id") id: string) {
    try {
      const tweets = await prisma.tweets.findMany({
        where: { userId: id },
      });

      const result = await getTweetsHelper(tweets, redis, prisma);

      return result;
    } catch (e) {
      console.log("ERROR: ", e);
      return null;
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(auth)
  async addTweets(
    @Arg("tweetURLs", () => [String]) tweetURLs: string[],
    @Ctx() { req, prisma }: context
  ) {
    try {
      const modTweets = tweetURLs.map((tweet) => {
        return { tweet: tweet.split("?")[0], userId: req.user!.id };
      });
      await prisma.tweets.createMany({
        data: modTweets as TweetsCreateManyInput[],
      });

      return true;
    } catch (e) {
      console.log("ERROR: ", e);
      return false;
    }
  }
  @Mutation(() => Tweet, { nullable: true })
  async getTweet(@Arg("url") url: string) {
    try {
      const access_token = process.env.TWITTER_ACCESS_TOKEN;
      const tweetUrl = url.split("status/")[1].split("?")[0];

      const tweetRes = await axios({
        method: "GET",
        url: `https://api.twitter.com/2/tweets/${tweetUrl}?expansions=attachments.poll_ids,attachments.media_keys,author_id&user.fields=profile_image_url,verified&tweet.fields=public_metrics&media.fields=url,preview_image_url,height,width`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      // if no errors found, return the tweet, else return null
      if (!tweetRes.data.errors) {
        const pollOptions: any[] =
          tweetRes.data.includes?.polls &&
          tweetRes.data.includes?.polls[0].options;
        const tweet = tweetRes.data.data;

        const {
          text,
          id,
          attachments,
          public_metrics: {
            like_count: likes,
            retweet_count: retweets,
            reply_count: replies,
          },
        } = tweet;

        const user = tweetRes.data.includes.users[0];
        return {
          url: url.split("?")[0],
          text,
          id,
          attachments,
          likes,
          user,
          retweets,
          replies,
          pollOptions,
          media: tweetRes.data.includes.media,
        };
      } else {
        throw new Error("tweet not found");
      }
    } catch (e: any) {
      return null;
    }
  }

  @Mutation(() => String)
  @UseMiddleware(auth)
  async deleteTweet(
    @Arg("url") url: string,
    @Ctx() { req, prisma, redis }: context
  ) {
    try {
      const tweet = await prisma.tweets.findFirst({
        where: { tweet: url, userId: req.user!.id },
      });
      if (!tweet) {
        return true;
      }
      const tweetCacheId = tweet.tweet.split("status/")[1].split("?")[0];
      await redis.dump(`tweet:${tweetCacheId}`);
      await prisma.tweets.delete({
        where: { id: tweet.id },
      });

      return tweet.tweet;
    } catch (e) {
      console.log("ERROR: ", e);
      return "error";
    }
  }
  @Query(() => [Tweet])
  async getLandingPageTweets(@Ctx() { prisma, redis }: context) {
    try {
      const tweets = await prisma.tweets.findMany({
        where: { userId: "f101e13e-863b-4b5b-a23d-62e3874db00e" },
      });

      const result = await getTweetsHelper(tweets, redis, prisma);

      return result;
    } catch (e) {
      console.log("ERROR: ", e);
    }
  }
}
