import { ErrorRequestHandler } from "express";
import IError from "../interface/error/IError";
import { ZodError } from "zod";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

const GlobalError: ErrorRequestHandler = (err, req, res, next) => {
  let { statusCode, ...error }: IError = {
    message:
      typeof err === "string" ? err : err.message || "Internal server error",
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
  } else if (err instanceof PrismaClientValidationError) {
    if (err.message.includes("Argument")) {
      error.message = "Argument" + err.message.split("Argument")[1];
    }
  }
  res.status(statusCode).send(error);
};

export default GlobalError;
