const chalk = require('chalk');

function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;

  if (status >= 500) {
    console.error(chalk.red.bold(`[ERROR ${status}] ${err.message}`));

    console.error(chalk.red(err.stack || err.message));
  } else if (status === 400 || status === 409) {
    console.warn(chalk.yellow.bold(`[VALIDACIÓN ${status}] ${err.message}`));
  } else {
    console.warn(chalk.blue(`[HTTP ${status}] ${err.message}`));
  }

  return res.status(status).json({
    error: status >= 500 ? 'Error interno del servidor' : err.message,
  });
}

module.exports = errorHandler;
