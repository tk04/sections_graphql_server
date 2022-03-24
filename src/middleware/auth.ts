import { MiddlewareFn } from "type-graphql";
import { context } from "../types/types";
import jwt from "jsonwebtoken";
export const auth: MiddlewareFn<context> = async ({ context }, next) => {
  const { prisma, req } = context;
  const token = req.cookies.token;

  if (token) {
    try {
      const userId = (jwt.decode(token) as jwt.JwtPayload & { userId: string })
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
    } catch (e) {
      console.log("USER NOT LOGGED IN");
    }
  }
};
