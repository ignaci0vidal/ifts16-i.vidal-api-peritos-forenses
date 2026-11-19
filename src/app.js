const express = require('express');
const morgan = require('morgan');
const logger = require('./utils/logger');

const peritosRoutes = require('./routes/peritos.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Interpretar peticiones JSON
// Registrar peticiones HTTP
app.use(morgan(logger.httpFormat));
app.use(express.json());

// Rutas de la API
app.use('/api/v1/peritos', peritosRoutes);

// Middleware global de errores
app.use(errorHandler);

module.exports = app;
