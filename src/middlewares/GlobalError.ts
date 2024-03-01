import { ErrorRequestHandler } from "express";
import IError from "../interface/error/IError";
import { ZodError } from "zod";

const GlobalError: ErrorRequestHandler = (err, req, res, next) => {
  let { statusCode, ...error }: IError = {
    message: err.message || "Internal server error",
    statusCode: 500,
    status: false,
    errorDef: {
      message: "",
      path: [""],
      exprect: "",
    },
  };

  if (err instanceof ZodError) {
    error.message =
      err.issues.map((e) => e.path[e.path.length - 1]).join(", ") +
      " " +
      err.issues[0].message;
    error.errorDef = {
      path: err.issues.map((e) => e.path[e.path.length - 1]),
      message:
        err.issues.map((e) => e.path[e.path.length - 1]).join(", ") +
        " " +
        err.issues[0].message,
    };
  }
  res.status(statusCode).send(error);
};

export default GlobalError;
