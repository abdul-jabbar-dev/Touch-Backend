import { Router } from "express";
import { getUsers, initUser, verifyEmail } from "./controller";
import createUserValidator from "./validate";
import ZValidator from "../../middlewares/zodValidator";
import JWTVerify from "../../middlewares/JWTVerify";

const UserRoute: Router = Router();
UserRoute.get("/", getUsers);
UserRoute.post("/init-user", ZValidator(createUserValidator), initUser);
UserRoute.post("/verify-email",JWTVerify(),  verifyEmail);
export default UserRoute;
