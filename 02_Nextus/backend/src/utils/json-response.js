export const jsonResponse = ( res,statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success, message,data
  });
};

export const success = (res,message = "Success",data = null, statusCode = 200) => {
  return jsonResponse(res, statusCode, true, message, data);
};

export const error = ( res,message = "Error",statusCode = 400, data = null) => {
  return jsonResponse(res, statusCode, false, message, data);
};
