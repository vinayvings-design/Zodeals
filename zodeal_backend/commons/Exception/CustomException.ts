import { serverError } from '../Utils/StatusCode.js';

const error = (
  errorCode = serverError,
  displayMessage: string,
  customStatusCode: number | null = null,
  customData: any = null
) => ({
  errorCode,
  displayMessage,
  customStatusCode,
  customData,
});

export { error };
