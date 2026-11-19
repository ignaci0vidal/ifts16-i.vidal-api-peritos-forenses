const app = require('./app');

const PORT = process.env.PORT || 3000;

const logger = require('./utils/logger');
const sequelize = require('./config/database');

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {
      logger.banner(PORT, sequelize.getDialect(), {
        storage: sequelize.options.storage,
        host: sequelize.config.host,
        port: sequelize.config.port,
        database: sequelize.config.database,
      });
    });
  } catch (error) {
    logger.error(error);
    await sequelize.close();
    process.exitCode = 1;
  }
}

start();
