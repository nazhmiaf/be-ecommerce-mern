export const notFound = (req, res, next) => {
  const error = new Error(`path not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode

  let message = err.message

  if (err.name === "validationError") {
    message = Object.values(err.errors).map((val) => val.message).join(", ")
    statusCode = 400
  }

  res.status(statusCode).json({
    message: message,
    stack: err.stack
  });
}