import { Response } from "express-serve-static-core";
import ISendResponse from "../../interface/utils/res/ISendResponse";

const sendResponse = <D, M>(
  res: Response,
  result: { message: string; data?: D; meta?: M }
) => {
  const data: ISendResponse<D, M> = {
    status: true,
    message: result.message,
    data: result.data,
    meta: result.meta,
  };
  res.send(data);
};
export default sendResponse;
