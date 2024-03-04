import { Router } from "express";
import {
    completeProfile,
  getUsers,
  initUser,
  resendOTP,
  updateProfile,
  verifyEmail,
} from "./controller";
import createUserValidator, { completeProfileValidator, updateUserValidator } from "./validate";
import ZValidator from "../../middlewares/zodValidator";
import JWTVerify from "../../middlewares/JWTVerify";

const UserRoute: Router = Router();
UserRoute.get("/", getUsers);
UserRoute.post("/init-user", ZValidator(createUserValidator), initUser);
UserRoute.post("/verify-email", JWTVerify(), verifyEmail);
UserRoute.get("/resend-otp/:email", resendOTP);
UserRoute.patch(
  "/update-profile",
  ZValidator(updateUserValidator),
  JWTVerify(),
  updateProfile
);
UserRoute.post(
  "/complete-profile",
  ZValidator(completeProfileValidator),
  JWTVerify(),
  completeProfile
);
export default UserRoute;
