 


import { Prisma } from "@prisma/client";
import * as express from "express";
import { IReqVerifyUser } from "../../interface/utils/req/IReqVerifyUser";
declare global {
  namespace Express {
    interface Request {
      authUser?: IReqVerifyUser
    }
  }
}