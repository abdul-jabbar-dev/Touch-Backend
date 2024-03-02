import { RequestHandler } from "express";
import sendResponse from "../../utils/res/sendResponse";
import catchAsync from "../../utils/common/catchAsync";
import { initUserDB } from "./service";

export const getUsers: RequestHandler = catchAsync(async (req, res) => {});

export const initUser: RequestHandler = catchAsync(async (req, res) => {
  const data: { email: string } = req.body;
  const result = await initUserDB(data);
  res.cookie("RefreshToken", result.credentials.refreshToken);
  sendResponse(res, { data: result, message: "UserRegister Successfully" });
});

export const verifyEmail: RequestHandler = catchAsync(async (req, res) => {
  console.log(req)
  // const data: { email: string } = req.body;
  // const result = await initUserDB(data);
  // res.cookie("RefreshToken", result.credentials.refreshToken);
  // sendResponse(res, { data: result, message: "UserRegister Successfully" });
});
