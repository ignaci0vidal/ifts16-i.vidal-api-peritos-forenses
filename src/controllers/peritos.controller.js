const createError = require('http-errors');
const { UniqueConstraintError } = require('sequelize');
const logger = require('../utils/logger');
const { Role, User } = require('../models');

// ==========================================
// POST /api/v1/peritos
// Registrar un nuevo perito
// ==========================================
async function crearPerito(req, res, next) {
  try {
    const { username, role_id } = req.body;

    // Validar que username no esté vacío
    if (typeof username !== 'string' || !username.trim()) {
      throw createError(400, 'El campo username es obligatorio');
    }

    // Validar que role_id sea un entero positivo
    if (!Number.isInteger(role_id) || role_id <= 0) {
      throw createError(400, 'El campo role_id debe ser un entero positivo');
    }

    // Verificar que el rol exista
    const rol = await Role.findByPk(role_id);

    if (!rol) {
      throw createError(400, 'El role_id indicado no existe');
    }

    // Crear el nuevo usuario
    const perito = await User.create({
      username: username.trim(),
      role_id,
    });

    // Mensaje cyan solicitado en la consigna
    logger.event('ALTA',
      `Perito #${perito.id} | usuario: ${perito.username} | rol: ${rol.nombre_rol}`);

    return res.status(201).json(perito);
  } catch (error) {
    // Username duplicado
    if (error instanceof UniqueConstraintError) {
      return next(createError(409, 'El username ya existe'));
    }

    return next(error);
  }
}

// ==========================================
// DELETE /api/v1/peritos/:id
// Baja lógica de un perito
// ==========================================
async function eliminarPerito(req, res, next) {
  try {
    const { id } = req.params;

    // Validar el ID
    if (!/^[1-9]\d*$/.test(id)) {
      throw createError(400, 'El ID debe ser un entero positivo');
    }

    // Buscar únicamente usuarios activos
    const perito = await User.findOne({
      where: {
        id,
        active: true,
      },
    });

    if (!perito) {
      throw createError(404, 'El perito no existe o está inactivo');
    }

    // Soft Delete: NO se elimina el registro
    await perito.update({ active: false });
    logger.event('BAJA',
      `Perito #${perito.id} | usuario: ${perito.username} | active: false`);

    return res.status(200).json({
      mensaje: 'Perito dado de baja correctamente',
      id: perito.id,
      active: perito.active,
    });
  } catch (error) {
    return next(error);
  }
}

// ==========================================
// GET /api/v1/peritos
// Listar peritos activos y filtrar por rol
// ==========================================
async function listarPeritos(req, res, next) {
  try {
    const { role } = req.query;

    const filtroUsuario = { active: true };
    const filtroRol = {};

    if (role !== undefined) {
      if (typeof role !== 'string' || !role.trim()) {
        throw createError(400, 'El parámetro role no puede estar vacío');
      }

      filtroRol.nombre_rol = role.trim();
    }

    const peritos = await User.findAll({
      where: filtroUsuario,
      include: [
        {
          model: Role,
          attributes: ['nombre_rol'],
          required: role !== undefined,
          ...(role !== undefined ? { where: filtroRol } : {}),
        },
      ],
    });

    return res.status(200).json(peritos);
  } catch (error) {
    return next(error);
  }
}

// ==========================================
// GET /api/v1/peritos/:id
// Consultar un perito activo
// ==========================================
async function obtenerPeritoPorId(req, res, next) {
  try {
    const { id } = req.params;

    // Validar el ID
    if (!/^[1-9]\d*$/.test(id)) {
      throw createError(400, 'El ID debe ser un entero positivo');
    }

    // Buscar usuario activo incluyendo su rol
    const perito = await User.findOne({
      where: {
        id,
        active: true,
      },
      include: [
        {
          model: Role,
          attributes: ['nombre_rol'],
        },
      ],
    });

    if (!perito) {
      throw createError(404, 'El perito no existe o está inactivo');
    }

    return res.status(200).json(perito);
  } catch (error) {
    return next(error);
  }
}

// Exportar las cuatro funciones
module.exports = {
  crearPerito,
  eliminarPerito,
  listarPeritos,
  obtenerPeritoPorId,
};
