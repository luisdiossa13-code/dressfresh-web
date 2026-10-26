// Capa de negocio: reglas del carrito (cantidad 1-10 por producto y sin superar el stock).
const { ErrorApp } = require('../../utils/errores');
const { v, primerError } = require('../../utils/validaciones');

module.exports = (repo) => {
  const resumen = (idUsuario) => {
    const items = repo.items(idUsuario);
    return { items, total: items.reduce((s, i) => s + i.subtotal, 0) };
  };
  return {
    ver: resumen,
    agregar(idUsuario, { id_producto, cantidad }) {
      const e = primerError([['id_producto', v.id(id_producto)], ['cantidad', v.cantidad(cantidad)]]);
      if (e) throw new ErrorApp(400, e.mensaje, e.campo);
      const prod = repo.producto(id_producto);
      if (!prod) throw new ErrorApp(404, 'Producto no encontrado.');
      const nueva = repo.cantidadActual(idUsuario, id_producto) + cantidad;
      if (nueva > 10) throw new ErrorApp(400, 'Máximo 10 unidades por producto.', 'cantidad');
      if (nueva > prod.stock) throw new ErrorApp(409, `Solo hay ${prod.stock} unidades disponibles.`, 'cantidad');
      repo.guardar(idUsuario, id_producto, nueva);
      return resumen(idUsuario);
    },
    quitar(idUsuario, idProducto) {
      if (v.id(idProducto)) throw new ErrorApp(400, 'Identificador no válido.');
      repo.quitar(idUsuario, idProducto);
      return resumen(idUsuario);
    }
  };
};
