import { Router } from "express";
import UserRoute from "../module/users/route";

const ROUTE = Router();
ROUTE.use('/users',UserRoute)
export default ROUTE;
