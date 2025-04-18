import ErrorTypes from "./ErrorTypes";

class ApiError extends Error {
  message: string;
  status: number;
  errorType: ErrorTypes;

  constructor(message: string, errorType: ErrorTypes) {
    super(message);
    this.message = message;
    this.name = 'ApiError';
    this.status = errorType;
    this.errorType = errorType;
  }
}

export default ApiError;