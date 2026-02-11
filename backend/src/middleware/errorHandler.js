// Custom error class
export class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
  let error = {
    message: err.message || 'Server Error',
    statusCode: err.statusCode || 500,
  };

  console.error({
    message: 'Server error occurred',
    path: req.originalUrl,
    method: req.method,
    error: err.message,
    stack: err.stack,
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.statusCode = 404;
    error.message = 'Resource not found';
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    error.statusCode = 400;
    error.message = 'Duplicate value entered';
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error.statusCode = 400;
    error.message = Object.values(err.errors)
      .map((val) => val.message)
      .join('; ') || 'Validation failed';
  }

  // JWT errors
  // ── JWT errors ──
  if (err.name === 'JsonWebTokenError') {
    error.statusCode = 401;
    error.message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    error.statusCode = 401;
    error.message = 'Token expired';
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    // Only in development
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
    }),
  });
};

// 404 Not Found handler
export const notFound = (req, res, next) => {
  const error = new ErrorResponse(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};