const chalk = require('chalk');

function errorHandler(err, req, res, next) {
  // Determinar el código HTTP
  const status = err.status || err.statusCode || 500;

  // Error crítico del servidor
  if (status >= 500) {
    console.error(chalk.red(`ERROR CRÍTICO ${status}: ${err.message}`));

    console.error(chalk.red(err.stack || err.message));
  }

  // Errores de validación
  else if (status === 400 || status === 409) {
    console.warn(chalk.yellow(`ERROR DE VALIDACIÓN ${status}: ${err.message}`));
  }

  // Otros errores HTTP, por ejemplo 404
  else {
    console.warn(chalk.yellow(`ERROR HTTP ${status}: ${err.message}`));
  }

  return res.status(status).json({
    error: status >= 500 ? 'Error interno del servidor' : err.message,
  });
}

module.exports = errorHandler;
