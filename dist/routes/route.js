"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("../module/users/route"));
const ROUTE = (0, express_1.Router)();
ROUTE.use('/users', route_1.default);
exports.default = ROUTE;
