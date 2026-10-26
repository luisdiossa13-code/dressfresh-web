// Error de negocio con código HTTP; lo transforma en respuesta el middleware global.
class ErrorApp extends Error {
  constructor(estado, mensaje, campo) { super(mensaje); this.estado = estado; this.campo = campo; }
}
module.exports = { ErrorApp };
