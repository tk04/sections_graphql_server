import { User } from "../entities/user";
import axios from "axios";
export const refreshTwitterToken = async (user: User) => {
  const data = await axios({
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
