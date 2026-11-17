const express = require('express');

const {
  crearPerito,
  eliminarPerito,
  listarPeritos,
  obtenerPeritoPorId,
} = require('../controllers/peritos.controller');

const router = express.Router();

router.post('/', crearPerito);
router.get('/', listarPeritos);
router.get('/:id', obtenerPeritoPorId);
router.delete('/:id', eliminarPerito);

module.exports = router;
