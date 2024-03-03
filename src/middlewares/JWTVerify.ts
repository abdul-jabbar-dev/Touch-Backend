import { RequestHandler } from "express";
import { decodeToken } from "../utils/jwt/JWT";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../connection/prisma/prismaInstance";
import { IReqVerifyUser } from "../interface/utils/req/IReqVerifyUser";

const JWTVerify = (): RequestHandler => async (req, res, next) => {
  if (!req.headers.cookie) {
    throw new Error("Validation token missing! try to login");
  } else {
    const path = "/verify-email";
    const token: string = req.headers.cookie;
    const data: JwtPayload = await decodeToken(token);
    const getUser: IReqVerifyUser | null = await prisma.users.findUnique({
      where: { id: data.id },
      include: { credentials: true },
    });
    if (
      getUser?.credentials?.accountStatus === "Verifying" &&
      req.path !== path
    ) {
      next("Account is not verified");
    }
    if (getUser) {
      req.authUser = getUser;
      next();
    } else {
      next("Authorization failed try again to login");
      throw "Authorization failed try again to login";
    }
  }
};
export default JWTVerify;
