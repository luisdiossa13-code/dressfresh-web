// Capa de datos del módulo Carrito de compras.
module.exports = (db) => ({
  items: (idUsuario) => db.prepare(`SELECT ci.id_producto, p.nombre, p.precio, ci.cantidad, p.stock,
        p.precio * ci.cantidad AS subtotal FROM carrito_item ci JOIN producto p USING (id_producto)
        WHERE ci.id_usuario = ? ORDER BY p.nombre`).all(idUsuario),
  producto: (id) => db.prepare('SELECT id_producto, stock FROM producto WHERE id_producto = ?').get(id),
  cantidadActual: (u, p) => db.prepare('SELECT cantidad FROM carrito_item WHERE id_usuario=? AND id_producto=?').get(u, p)?.cantidad ?? 0,
  guardar: (u, p, cant) => db.prepare(`INSERT INTO carrito_item(id_usuario,id_producto,cantidad) VALUES (?,?,?)
        ON CONFLICT(id_usuario,id_producto) DO UPDATE SET cantidad = excluded.cantidad`).run(u, p, cant),
  quitar: (u, p) => db.prepare('DELETE FROM carrito_item WHERE id_usuario=? AND id_producto=?').run(u, p)
  // TODO: vaciar carrito y convertirlo en pedido (módulo de pagos, siguiente iteración).
});
