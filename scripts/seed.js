const sequelize = require('../src/config/database');
const { Role, User } = require('../src/models');

async function seed() {
  try {
    // Comprobar la conexión con la base de datos
    await sequelize.authenticate();

    // Crear las tablas si todavía no existen
    await sequelize.sync();

    // Crear los tres roles obligatorios
    const roles = ['ADMIN', 'FORENSIC_INSPECTOR', 'AUDITOR'];

    for (const nombre_rol of roles) {
      await Role.findOrCreate({
        where: { nombre_rol },
      });
    }

    console.log('Roles cargados correctamente');

    // Recuperar los roles para obtener sus ID
    const admin = await Role.findOne({
      where: { nombre_rol: 'ADMIN' },
    });

    const inspector = await Role.findOne({
      where: { nombre_rol: 'FORENSIC_INSPECTOR' },
    });

    const auditor = await Role.findOne({
      where: { nombre_rol: 'AUDITOR' },
    });

    // Crear tres usuarios de prueba
    const usuarios = [
      { username: 'admin_test', role_id: admin.id },
      { username: 'inspector_test', role_id: inspector.id },
      { username: 'auditor_test', role_id: auditor.id },
    ];

    for (const usuario of usuarios) {
      await User.findOrCreate({
        where: { username: usuario.username },
        defaults: { role_id: usuario.role_id },
      });
    }

    console.log('Usuarios de prueba cargados correctamente');
  } catch (error) {
    console.error('Error al cargar datos:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

seed();

//seed() es async porque las operaciones de la BBDD necesitan esperar a que se completen antes de continuar. Esto permite manejar correctamente las promesas y errores que puedan surgir durante la ejecución de las operaciones de la base de datos.
//await sequelize.authenticate() comprueba la conexión, mientras que await sequelize.sync() asegura que existan las tablas.
