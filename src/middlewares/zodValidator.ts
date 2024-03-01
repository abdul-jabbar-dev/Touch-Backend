import { RequestHandler } from "express";
import { ZodTypeAny } from "zod";
const ZValidator =
  (obj: ZodTypeAny): RequestHandler =>
  (req, res, next) => {
    try {
      obj.parse(req);
      next()
    } catch (err) {
      next(err);
    }
  };
export default ZValidator;
