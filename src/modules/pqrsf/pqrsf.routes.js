// Capa de presentación (API) del módulo PQRSF.
const { Router } = require('express');
module.exports = (servicio) => {
  const r = Router();
  r.post('/', (req, res) => res.status(201).json(servicio.radicar(req.body || {})));
  r.get('/:id', (req, res) => res.json(servicio.consultar(Number(req.params.id))));
  return r;
};
