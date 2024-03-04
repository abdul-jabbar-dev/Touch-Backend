import { RequestHandler } from "express";
import sendResponse from "../../utils/res/sendResponse";
import catchAsync from "../../utils/common/catchAsync";
import {
  completeProfileDB,
  initUserDB,
  resendOTP_DB,
  updateProfileDB,
  verifyEmailDB,
} from "./service";
import { IReqVerifyUser } from "../../interface/utils/req/IReqVerifyUser";
import { userInfos, users } from "@prisma/client";
export const getUsers: RequestHandler = catchAsync(async (req, res) => {});

export const initUser: RequestHandler = catchAsync(async (req, res) => {
  const data: { email: string } = req.body;
  const result = await initUserDB(data);
  res.cookie("RefreshToken", result.credentials.refreshToken);
  sendResponse(res, { data: result, message: "UserRegister Successfully" });
});

export const verifyEmail: RequestHandler = catchAsync(
  async (req, res, next) => {
    const otp: number | null = req.headers.otp
      ? parseInt(req.headers.otp as string)
      : null;
    if (otp === null) {
      next("OTP is missing");
    } else {
      const activeUser: IReqVerifyUser = req.authUser!;

      const isSuccess = await verifyEmailDB({ otp, activeUser });

      sendResponse(res, {
        message: "user Verification successful",
        data: isSuccess,
      });
    }
  }
);

export const resendOTP: RequestHandler = catchAsync(async (req, res) => {
  const email: string = req.params.email;
  const result = await resendOTP_DB(email);
  if (result) {
    sendResponse(res, {
      message: "We have sent you a password recover link to your email",
    });
  } else {
    throw new Error("Internal server error");
  }
});

export const updateProfile: RequestHandler = catchAsync(async (req, res) => {
  const activeUser: IReqVerifyUser = req.authUser!;
  const body: Partial<userInfos> = req.body;

  const result: userInfos = await updateProfileDB(activeUser, body);

  if (result) {
    sendResponse(res, {
      message: "Profile Update successfully",
      data: result,
    });
  } else {
    throw new Error("Internal server error");
  }
});

export const completeProfile: RequestHandler = catchAsync(async (req, res) => {
  const activeUser: IReqVerifyUser = req.authUser!;
  const body: Omit<userInfos, "id" | "usersId"> = req.body;
 
  const result: users = await completeProfileDB(activeUser, body);

  if (result) {
    sendResponse(res, {
      message: "Profile Update successfully",
      data: result,
    });
  } else {
    throw new Error("Internal server error");
  }
});
