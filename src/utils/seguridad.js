// Utilidades de seguridad: hash de contraseñas (scrypt) y tokens de sesión firmados (HMAC-SHA256).
const crypto = require('crypto');

function hashClave(clave) {
  const sal = crypto.randomBytes(16).toString('hex');
  return `${sal}:${crypto.scryptSync(clave, sal, 32).toString('hex')}`;
}
function verificarClave(clave, guardado) {
  const [sal, hash] = String(guardado).split(':');
  if (!sal || !hash) return false;
  const calculado = crypto.scryptSync(clave, sal, 32);
  return crypto.timingSafeEqual(calculado, Buffer.from(hash, 'hex'));
}
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
function crearToken(datos, secreto, vigenciaSeg) {
  const cuerpo = b64({ ...datos, exp: Math.floor(Date.now() / 1000) + vigenciaSeg });
  const firma = crypto.createHmac('sha256', secreto).update(cuerpo).digest('base64url');
  return `${cuerpo}.${firma}`;
}
function leerToken(token, secreto) {
  const [cuerpo, firma] = String(token).split('.');
  if (!cuerpo || !firma) return null;
  const esperada = crypto.createHmac('sha256', secreto).update(cuerpo).digest('base64url');
  if (firma.length !== esperada.length || !crypto.timingSafeEqual(Buffer.from(firma), Buffer.from(esperada))) return null;
  const datos = JSON.parse(Buffer.from(cuerpo, 'base64url').toString());
  return datos.exp > Math.floor(Date.now() / 1000) ? datos : null;
}
module.exports = { hashClave, verificarClave, crearToken, leerToken };
