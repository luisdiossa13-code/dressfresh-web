// Capa de datos del módulo Cuentas de usuario.
module.exports = (db) => ({
  buscarPorCorreo: (correo) => db.prepare('SELECT * FROM usuario WHERE correo = ?').get(correo),
  buscarPorId: (id) => db.prepare('SELECT id_usuario, nombre, correo, rol FROM usuario WHERE id_usuario = ?').get(id),
  crear({ nombre, correo, claveHash }) {
    const r = db.prepare('INSERT INTO usuario(nombre, correo, clave_hash) VALUES (?,?,?)').run(nombre, correo, claveHash);
    return Number(r.lastInsertRowid);
  }
  // TODO: actualizar perfil, cambiar contraseña, recuperar contraseña por correo.
});
