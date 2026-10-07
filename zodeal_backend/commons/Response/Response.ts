import { serverError, successCode } from "../Utils/StatusCode.js";
import { unknownErrorMessage, successMessage } from "../Constant/Constants.js";
import { Response } from "express";

interface ResponseData {
  statusCode: number;
  result: any;
  displayMessage: string | null;
  status: boolean;
}

const createResponse = ({
  statusCode,
  displayMessage = null,
  data = null,
  status,
}: {
  statusCode: number;
  displayMessage?: string | null;
  data?: any | null;
  status: boolean;
}): ResponseData => ({
  statusCode,
  result: data,
  displayMessage,
  status,
});

const handleErrorResponse = (
  errorObj: { errorCode?: number; displayMessage?: string },
  res: Response
) => {
  const statusCode = errorObj.errorCode || serverError;
  const response = createResponse({
    statusCode,
    displayMessage: errorObj.displayMessage || unknownErrorMessage,
    status: false,
  });
  return res.status(statusCode).json(response);
};

const handleSuccessResponse = (
  data: { statusCode: number; result: any },
  res: Response,
  displayMessage = successMessage
) => {
  const { statusCode, result } = data;
  const response = {
    statusCode,
    result,
    displayMessage,
    status: true,
  };
  return res.status(statusCode).json(response);
};

export { handleErrorResponse, handleSuccessResponse };
