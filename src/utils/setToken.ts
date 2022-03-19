import { Response } from "express";
import jwt from "jsonwebtoken";
export const setToken = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });

  res.cookie("token2", token, {
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });
  res.cookie("token", token, {
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });
};
