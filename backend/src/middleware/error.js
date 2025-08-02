const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const isDev = process.env.NODE_ENV === 'development';

  const clientMessage =
    statusCode >= 500
      ? 'Something went wrong on our end. Please try again later.'
      : err.message || 'An error occurred.';

  if (isDev || statusCode >= 500) {
    console.error('\n🔴 [ERROR]', {
      statusCode,
      message: err.message,
      stack: err.stack,
    });
  }

  res.status(statusCode).json({
    success: false,
    message: clientMessage,
    ...(isDev && { error: err.message, stack: err.stack }),
  });
};

module.exports = errorHandler;
