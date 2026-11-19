const chalk = require('chalk');

function line(label, color, message) {
  return `${color.bold(`[${label}]`.padEnd(13))} ${message}`;
}

function statusColor(status) {
  if (status >= 500) return chalk.red;
  if (status === 400 || status === 409) return chalk.yellow;
  if (status >= 400) return chalk.blue;
  if (status >= 300) return chalk.cyan;
  return chalk.green;
}

function httpFormat(tokens, req, res) {
  const status = tokens.status(req, res);
  return line('HTTP', chalk.blue,
    `${tokens.method(req, res).padEnd(7)} ${tokens.url(req, res)}  ${statusColor(Number(status))(status || '-')}`);
}

function event(label, message) {
  console.log(line(label, chalk.cyan, message));
}

function error(err, status = 500) {
  console.error(line('ERROR', chalk.red, `${chalk.red(status)} · ${err.message}`));
  const stack = err.stack?.split('\n').slice(1).join('\n');
  if (stack) console.error(chalk.red.dim(stack));
}

function warning(status, message) {
  const validation = status === 400 || status === 409;
  console.warn(line(validation ? 'VALIDACIÓN' : 'HTTP', statusColor(status),
    `${statusColor(status)(status)} · ${message}`));
}

function banner(port, dialect, storage) {
  const border = chalk.green('─'.repeat(60));
  console.log(`\n${border}`);
  console.log(line('SERVIDOR', chalk.green, 'API de Gestión de Peritos Forenses'));
  console.log(line('URL', chalk.green, `http://localhost:${port}`));
  console.log(line('DATABASE', chalk.green,
    `${dialect === 'sqlite' ? 'SQLite' : 'PostgreSQL'} conectado${dialect === 'sqlite' ? ` · ${storage}` : ''}`));
  console.log(`${border}\n`);
}

module.exports = { httpFormat, event, error, warning, banner };
