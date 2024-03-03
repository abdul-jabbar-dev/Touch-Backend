import { Router } from "express";
import { getUsers, initUser, resendOTP, verifyEmail } from "./controller";
import createUserValidator from "./validate";
import ZValidator from "../../middlewares/zodValidator";
import JWTVerify from "../../middlewares/JWTVerify"; 
 
const UserRoute: Router = Router();
UserRoute.get("/", getUsers);
UserRoute.post("/init-user", ZValidator(createUserValidator), initUser);
UserRoute.post("/verify-email",JWTVerify(), verifyEmail);
UserRoute.get("/resend-otp/:email", resendOTP);
export default UserRoute;
