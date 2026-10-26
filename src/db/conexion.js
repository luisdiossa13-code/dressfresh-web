// Conexión a la base de datos (SQLite incluido en Node 22: no requiere servidor aparte).
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

function abrirBD(archivo = ':memory:') {
  if (archivo !== ':memory:') fs.mkdirSync(path.dirname(archivo), { recursive: true });
  const db = new DatabaseSync(archivo);
  db.exec('PRAGMA foreign_keys = ON');
  db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));
  return db;
}
module.exports = { abrirBD };
