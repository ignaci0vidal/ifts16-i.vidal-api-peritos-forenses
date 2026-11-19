const { Sequelize } = require('sequelize');
require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'sqlite';

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
