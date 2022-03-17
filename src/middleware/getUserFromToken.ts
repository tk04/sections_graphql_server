import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
export const getUserFromToken = async (token: string, prisma: PrismaClient) => {
  try {
    const userId = (jwt.decode(token) as jwt.JwtPayload & { userId: string })
      .userId;
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (e) {
    console.log("USER NOT LOGGED IN");
  }
};
