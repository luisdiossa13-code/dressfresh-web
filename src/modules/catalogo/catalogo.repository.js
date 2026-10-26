// Capa de datos del módulo Catálogo: solo consultas SQL.
module.exports = (db) => ({
  listar({ categoria, busqueda, promocion }) {
    let sql = `SELECT p.id_producto, p.nombre, p.marca, p.precio, p.precio_anterior, p.stock,
                      p.en_promocion, c.nombre AS categoria
               FROM producto p JOIN categoria c USING (id_categoria) WHERE 1=1`;
    const args = [];
    if (categoria) { sql += ' AND c.nombre = ?'; args.push(categoria); }
    if (busqueda) { sql += ' AND (p.nombre LIKE ? OR p.marca LIKE ?)'; args.push(`%${busqueda}%`, `%${busqueda}%`); }
    if (promocion) sql += ' AND p.en_promocion = 1';
    return db.prepare(sql + ' ORDER BY p.nombre').all(...args);
  },
  buscarPorId(id) {
    return db.prepare(`SELECT p.*, c.nombre AS categoria FROM producto p
                       JOIN categoria c USING (id_categoria) WHERE p.id_producto = ?`).get(id);
  },
  categorias() { return db.prepare('SELECT nombre FROM categoria ORDER BY nombre').all().map((c) => c.nombre); }
  // TODO (siguiente iteración): crear, editar y eliminar productos (solo administrador).
});
