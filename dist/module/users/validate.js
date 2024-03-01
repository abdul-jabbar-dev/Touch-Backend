"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const createUserValidator = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email({ message: "Invalid email address" }),
        fullName: zod_1.z.string()
    }),
});
exports.default = createUserValidator;
