import { RequestHandler } from "express"; 
import sendResponse from "../../utils/res/sendResponse";
import catchAsync from "../../utils/common/catchAsync";
import { initUserDB } from "./service";

export const getUsers: RequestHandler = catchAsync(async (req, res) => {

});

export const initUser: RequestHandler = catchAsync(async (req, res) => {

    const data: { email: string;  } = req.body;
    const result = await initUserDB(data);

    sendResponse(res, { data: result, message: "Successful" });
});
