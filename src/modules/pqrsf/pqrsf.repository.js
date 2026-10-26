// Capa de datos del módulo PQRSF.
module.exports = (db) => ({
  crear({ tipo, nombre, correo, mensaje }) {
    const r = db.prepare('INSERT INTO pqrsf(tipo,nombre,correo,mensaje) VALUES (?,?,?,?)').run(tipo, nombre, correo, mensaje);
    return Number(r.lastInsertRowid);
  },
  buscar: (id) => db.prepare('SELECT id_pqrsf, tipo, estado, creado_en FROM pqrsf WHERE id_pqrsf = ?').get(id)
  // TODO: listado y respuesta del administrador, cambio de estado, notificación por correo.
});
