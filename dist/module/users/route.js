"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const validate_1 = __importDefault(require("./validate"));
const zodValidator_1 = __importDefault(require("../../middlewares/zodValidator"));
const UserRoute = (0, express_1.Router)();
UserRoute.get("/", controller_1.getUsers);
UserRoute.post("/init-user", (0, zodValidator_1.default)(validate_1.default), controller_1.initUser);
exports.default = UserRoute;
