import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { User } from "../entities/user";
import { Redis } from "ioredis";
export interface GoogleIdToken {
  iss: string;
  azp: string;
  sub: string;
  picture: string;
  email: string;
  given_name: string;
  name: string;
  email_verified: boolean;
}

export interface context {
  prisma: PrismaClient;
  req: Request & { user?: User };
  res: Response;
  redis: Redis;
}
