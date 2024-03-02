import { RequestHandler } from "express";
import { decodeToken } from "../utils/jwt/JWT";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../connection/prisma/prismaInstance";
import { Prisma, credentials, users } from "@prisma/client";

const JWTVerify = (): RequestHandler => async (req, res, next) => {
  if (!req.headers.cookie) {
    throw new Error("Validation token missing! try to login");
  } else {
    const token: string = req.headers.cookie;
    const data: JwtPayload = await decodeToken(token);
    const getUser: Prisma.usersGetPayload<{
      include: { credentials: true };
    }> | null = await prisma.users.findUnique({
      where: { id: data.id },
      include: { credentials: true },
    });
    if (getUser) {
      req.authUser = getUser;
    } else {
      throw "Authorization failed try again to login";
    }
  }
};
export default JWTVerify;
