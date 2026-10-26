// Seguridad transversal: cabeceras HTTP, límite de peticiones y autenticación por token.
const { leerToken } = require('../utils/seguridad');
const { ErrorApp } = require('../utils/errores');

function cabecerasSeguras(req, res, next) {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Content-Security-Policy': "default-src 'self'; style-src 'self' 'unsafe-inline'"
  });
  res.removeHeader('X-Powered-By');
  next();
}
// Límite simple por IP (en memoria): evita abusos y fuerza bruta básica.
function limitador(maxPorMinuto) {
  const visitas = new Map();
  return (req, res, next) => {
    const ahora = Date.now(), ip = req.ip;
    const r = (visitas.get(ip) || []).filter((t) => ahora - t < 60000);
    r.push(ahora); visitas.set(ip, r);
    if (r.length > maxPorMinuto) return next(new ErrorApp(429, 'Demasiadas peticiones. Intenta en un minuto.'));
    next();
  };
}
function requiereSesion(secreto) {
  return (req, res, next) => {
    const t = (req.get('Authorization') || '').replace(/^Bearer /, '');
    const datos = t && leerToken(t, secreto);
    if (!datos) return next(new ErrorApp(401, 'Debes iniciar sesión.'));
    req.usuario = datos; next();
  };
}
module.exports = { cabecerasSeguras, limitador, requiereSesion };
