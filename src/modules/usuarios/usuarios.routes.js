// Capa de presentación (API) del módulo Cuentas de usuario.
const { Router } = require('express');
module.exports = (servicio, requiereSesion) => {
  const r = Router();
  r.post('/registro', (req, res) => res.status(201).json(servicio.registrar(req.body || {})));
  r.post('/login', (req, res) => res.json(servicio.ingresar(req.body || {})));
  r.get('/perfil', requiereSesion, (req, res) => res.json(servicio.perfil(req.usuario.id)));
  return r;
};
