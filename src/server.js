const app = require('./app');

const PORT = process.env.PORT || 3000;

const chalk = require('chalk');
const sequelize = require('./config/database');

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(
        chalk.green.bold('[SERVIDOR]') +
          chalk.green(` API disponible en http://localhost:${PORT}`),
      );
    });
  } catch (error) {
    console.error(chalk.red(error.stack || error.message));
    await sequelize.close();
    process.exitCode = 1;
  }
}

start();
