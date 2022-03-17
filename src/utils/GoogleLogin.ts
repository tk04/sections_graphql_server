import { PrismaClient } from "@prisma/client";
import axios from "axios";
import jwt from "jsonwebtoken";
import { GoogleIdToken } from "../types/types";
export const GoogleLogin = async (code: string, prisma: PrismaClient) => {
  const data = await axios({
    url: "https://oauth2.googleapis.com/token",
    method: "POST",
    data: `code=${code}&client_id=${
      process.env.GOOGLE_CLIENT_ID
    }&client_secret=${process.env.GOOGLE_CLIENT_SECRET}&redirect_uri=${
      process.env.NODE_ENV == "production"
        ? "https://sections1.vercel.app/cb"
        : "http://localhost:3000/cb"
    }&grant_type=authorization_code`,
  }).catch((e) => console.log(e));
  let user;
  if (data && data.data && data.data.id_token) {
    const { id_token } = data.data;
    const token_data = jwt.decode(id_token) as GoogleIdToken;
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
  } else {
    throw new Error("Could not authennticate with Google");
  }
};
