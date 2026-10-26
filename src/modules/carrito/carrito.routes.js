// Capa de presentación (API) del módulo Carrito. Todas las rutas exigen sesión.
const { Router } = require('express');
module.exports = (servicio, requiereSesion) => {
  const r = Router();
  r.use(requiereSesion);
  r.get('/', (req, res) => res.json(servicio.ver(req.usuario.id)));
  r.post('/', (req, res) => res.status(201).json(servicio.agregar(req.usuario.id, req.body || {})));
  r.delete('/:idProducto', (req, res) => res.json(servicio.quitar(req.usuario.id, Number(req.params.idProducto))));
  return r;
};
