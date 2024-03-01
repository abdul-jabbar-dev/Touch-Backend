import { Router } from "express";
import { getUsers, initUser } from "./controller";
import createUserValidator from "./validate";
import ZValidator from "../../middlewares/zodValidator";

const UserRoute: Router = Router();
UserRoute.get("/", getUsers);
UserRoute.post("/init-user", ZValidator(createUserValidator), initUser);
export default UserRoute;
