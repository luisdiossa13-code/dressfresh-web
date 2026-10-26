// Configuración central: valores leídos del entorno con valores por defecto para desarrollo.
const path = require('path');
module.exports = {
  puerto: Number(process.env.PORT) || 3000,
  archivoBD: process.env.DB_FILE || path.join(__dirname, '..', '..', 'data', 'dressfresh.db'),
  secretoToken: process.env.TOKEN_SECRET || 'dev-secreto-solo-para-desarrollo',
  vigenciaTokenSeg: 60 * 60 * 2,        // la sesión dura 2 horas
  limitePeticionesPorMinuto: 120
};
