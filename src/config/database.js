const { Sequelize } = require('sequelize'); //Importa la clase que administra la conexión y los modelos.
require('dotenv').config(); //Carga las variables de .env en process.env si no estaban definidas previamente.

const dialect = process.env.DB_DIALECT || 'sqlite'; //Si no se indica un motor, utiliza SQLite. Es una decisión orientada a una ejecución local simple.

let sequelize;

if (dialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './forensics.db',
    // Sequelize 6 ejecuta PRAGMA FOREIGN_KEYS=ON al abrir cada conexión SQLite.
    logging: false,
  });
} else if (dialect === 'postgres') {
  sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: false,
  });
} else {
  throw new Error(`Motor de base de datos no soportado: ${dialect}`);
}

module.exports = sequelize;
