// Capa de negocio del módulo Catálogo.
const { ErrorApp } = require('../../utils/errores');
const { v } = require('../../utils/validaciones');

module.exports = (repo) => ({
  listar(filtros) {
    const busqueda = String(filtros.busqueda ?? '').trim().slice(0, 60);
    return repo.listar({ categoria: filtros.categoria, busqueda, promocion: filtros.promocion === '1' });
  },
  detalle(id) {
    if (v.id(id)) throw new ErrorApp(400, 'Identificador no válido.');
    const p = repo.buscarPorId(id);
    if (!p) throw new ErrorApp(404, 'Producto no encontrado.');
    return p;
  },
  categorias: () => repo.categorias()
});
