const Role = require('./role');
const User = require('./user');

// Relación uno a muchos
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

module.exports = { Role, User };
