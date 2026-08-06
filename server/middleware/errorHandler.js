/**
 * Centralized Express Error Handling Middleware
 */
export function errorHandler(err, req, res, next) {
  console.error(`❌ [Error] ${req.method} ${req.originalUrl}:`, err.stack || err.message || err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  const response = {
    success: false,
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  };

  // In development, include stack trace for easier debugging
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`
  });
}
