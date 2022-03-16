import axios from "axios";
import { PrismaClient } from "@prisma/client";
export const TwitterLogin = async (code: string, prisma: PrismaClient) => {
  try {
    const data = await axios({
      method: "POST",
      url: "https://api.twitter.com/2/oauth2/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: `code=${code}&grant_type=authorization_code&redirect_uri=http://localhost:3000/twitter_cb&code_verifier=challenge&client_id=${process.env.TWITTER_CLIENT_ID}`,
    });

    if (data.data) {
      const userInfo = await axios({
        method: "GET",
        url: "https://api.twitter.com/2/users/me?user.fields=profile_image_url,name,verified",
        headers: {
          Authorization: `Bearer ${data.data.access_token}`,
        },
      });

      let user = await prisma.user.findFirst({
        where: { twitterId: userInfo.data.data.id },
      });
      if (user) {
      } else {
        user = await prisma.user.create({
          data: {
            name: userInfo.data.data.name,
            email: userInfo.data.data.email,
            picture: userInfo.data.data.profile_image_url,
            twitterId: userInfo.data.data.id,
            twitterAccessToken: data.data.access_token,
          },
        });
      }
      return user;
    }
  } catch (e) {
    throw new Error("Could not authenticate with Twitter");
  }
};
