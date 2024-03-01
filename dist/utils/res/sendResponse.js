"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, result) => {
    const data = {
        status: true,
        message: result.message,
        data: result.data,
        meta: result.meta,
    };
    res.send(data);
};
exports.default = sendResponse;
