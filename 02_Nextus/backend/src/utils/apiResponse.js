// utils/apiResponse.js

class ApiSuccess {
  constructor(statusCode, data = null, message = "Success") {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString(); // ✅ add timestamp
  }
}



class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.message = message;
    this.errors = errors;
    this.data = null;
    this.timestamp = new Date().toISOString(); // ✅ add timestamp

    Error.captureStackTrace(this, this.constructor);
  }
}


export { ApiSuccess, ApiError };
