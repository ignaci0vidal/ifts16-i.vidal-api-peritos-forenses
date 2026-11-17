const express = require('express');
const morgan = require('morgan');

const peritosRoutes = require('./routes/peritos.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Interpretar peticiones JSON
app.use(express.json());

// Registrar peticiones HTTP
app.use(morgan('dev'));

// Rutas de la API
app.use('/api/v1/peritos', peritosRoutes);

// Middleware global de errores
app.use(errorHandler);

module.exports = app;
