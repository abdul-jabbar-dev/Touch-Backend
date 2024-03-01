"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const GlobalError = (err, req, res, next) => {
    let _a = {
        message: err.message || "Internal server error",
        statusCode: 500,
        status: false,
        errorDef: {
            message: "",
            path: [""],
            exprect: "",
        },
    }, { statusCode } = _a, error = __rest(_a, ["statusCode"]);
    if (err instanceof zod_1.ZodError) {
        error.message =
            err.issues.map((e) => e.path[e.path.length - 1]).join(", ") +
                " " +
                err.issues[0].message;
        error.errorDef = {
            path: err.issues.map((e) => e.path[e.path.length - 1]),
            message: err.issues.map((e) => e.path[e.path.length - 1]).join(", ") +
                " " +
                err.issues[0].message,
        };
    }
    res.status(statusCode).send(error);
};
exports.default = GlobalError;
