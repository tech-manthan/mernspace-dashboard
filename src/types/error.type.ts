import type { AxiosError, AxiosResponse } from "axios";

interface ErrorResponseData {
  errors: Array<{ msg: string }>;
}

export interface ResponseError extends AxiosError<ErrorResponseData> {
  response: AxiosResponse<ErrorResponseData>;
}
