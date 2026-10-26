// Capa de presentación (API) del módulo Catálogo.  GET /api/catalogo/...
const { Router } = require('express');
module.exports = (servicio) => {
  const r = Router();
  r.get('/', (req, res) => res.json(servicio.listar(req.query)));
  r.get('/categorias', (req, res) => res.json(servicio.categorias()));
  r.get('/:id', (req, res) => res.json(servicio.detalle(Number(req.params.id))));
  return r;
};
