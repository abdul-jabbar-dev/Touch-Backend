"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ZValidator = (obj) => (req, res, next) => {
    try {
        obj.parse(req);
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.default = ZValidator;
