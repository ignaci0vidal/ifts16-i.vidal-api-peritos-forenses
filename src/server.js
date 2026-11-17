const app = require('./app');

const PORT = process.env.PORT || 3000;

const chalk = require('chalk');

app.listen(PORT, () => {
  console.log(
    chalk.green.bold('[SERVIDOR]') +
      chalk.green(` API disponible en http://localhost:${PORT}`),
  );
});
