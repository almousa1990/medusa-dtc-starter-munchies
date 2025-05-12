import {ErrorResponse, ErrorType} from "@/types";

export const formatErrorResponse = (error: ErrorResponse) => {
  let message;
  switch (error.type) {
    case ErrorType.Validation:
      message = "البيانات المدخلة غير صحيحة";
      break;
    default:
      message = error.message;
  }

  return {...error, message: message};
};
