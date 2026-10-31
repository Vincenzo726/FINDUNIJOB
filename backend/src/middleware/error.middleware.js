function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.path}` });
}
function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  const status = error.statusCode || (error.name === 'ValidationError' ? 400 : error.code === 11000 ? 409 : 500);
  const message = status === 500 && process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message;
  res.status(status).json({ success: false, message, ...(status === 400 && error.errors ? { errors: Object.values(error.errors).map((e) => e.message) } : {}) });
}
module.exports = { notFound, errorHandler };