interface IError {
  statusCode: number;
  status: false;
  message: string;
  errorDef?: IErrorDef;
}
export interface IErrorDef {
  path: string | (string | number)[];
  message: string;
  exprect?: string;
}
export default IError;
