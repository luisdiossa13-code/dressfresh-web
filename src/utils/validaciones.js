// Reglas de validación (mismas del formulario web). Cada función devuelve '' si es válido o el mensaje de error.
const L = 'A-Za-zÁÉÍÓÚÜÑáéíóúüñ';
const reNombre = new RegExp(`^[${L}]+(?:[ '\\-][${L}]+)*$`);
const reCorreo = /^[^\s@.]+(?:\.[^\s@.]+)*@[^\s@.]+(?:\.[^\s@.]+)*\.[A-Za-z]{2,}$/;
const TIPOS_PQRSF = ['peticion', 'queja', 'reclamo', 'sugerencia', 'felicitacion'];

const v = {
  nombre(x) {
    x = String(x ?? '').trim().replace(/\s+/g, ' ');
    if (!x) return 'El nombre es obligatorio.';
    if (x.length < 3) return 'El nombre debe tener al menos 3 caracteres.';
    if (x.length > 60) return 'El nombre no puede superar 60 caracteres.';
    if (!reNombre.test(x)) return 'Solo se permiten letras, espacios, guion y apóstrofo.';
    return '';
  },
  correo(x) {
    x = String(x ?? '').trim();
    if (!x) return 'El correo es obligatorio.';
    if (x.length > 120) return 'El correo no puede superar 120 caracteres.';
    if (!reCorreo.test(x)) return 'Escribe un correo válido, por ejemplo nombre@dominio.com.';
    return '';
  },
  clave(x) {
    x = String(x ?? '');
    if (!x) return 'La contraseña es obligatoria.';
    if (/\s/.test(x)) return 'La contraseña no puede contener espacios.';
    if (x.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
    if (x.length > 30) return 'La contraseña no puede superar 30 caracteres.';
    return '';
  },
  mensaje(x) {
    x = String(x ?? '').trim();
    if (!x) return 'El mensaje es obligatorio.';
    if (x.length < 10) return 'El mensaje debe tener al menos 10 caracteres.';
    if (x.length > 500) return 'El mensaje no puede superar 500 caracteres.';
    if (/[<>]/.test(x)) return 'No se permiten los caracteres < y >.';
    return '';
  },
  tipoPqrsf(x) { return TIPOS_PQRSF.includes(x) ? '' : 'Selecciona un tipo de solicitud válido.'; },
  cantidad(x) { return Number.isInteger(x) && x >= 1 && x <= 10 ? '' : 'La cantidad debe ser un entero entre 1 y 10.'; },
  id(x) { return Number.isInteger(x) && x > 0 ? '' : 'Identificador no válido.'; }
};
// Devuelve el primer error de una lista de [campo, mensaje]; null si todo está bien.
function primerError(pares) { const e = pares.find(([, m]) => m); return e ? { campo: e[0], mensaje: e[1] } : null; }
module.exports = { v, primerError, TIPOS_PQRSF };
