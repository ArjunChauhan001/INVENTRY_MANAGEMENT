const ENV_VARS = require('../config/envVars')
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
    // Uncomment above line and set NODE_ENV to production for hiding stack trace
  });
};

module.exports = { errorHandler };
