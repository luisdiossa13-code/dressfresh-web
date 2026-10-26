// Capa de negocio: registra una solicitud PQRSF y devuelve su número de radicado.
const { ErrorApp } = require('../../utils/errores');
const { v, primerError } = require('../../utils/validaciones');

module.exports = (repo) => ({
  radicar({ tipo, nombre, correo, mensaje }) {
    const e = primerError([['tipo', v.tipoPqrsf(tipo)], ['nombre', v.nombre(nombre)], ['correo', v.correo(correo)], ['mensaje', v.mensaje(mensaje)]]);
    if (e) throw new ErrorApp(400, e.mensaje, e.campo);
    const id = repo.crear({ tipo, nombre: nombre.trim().replace(/\s+/g, ' '), correo: correo.trim().toLowerCase(), mensaje: mensaje.trim() });
    return repo.buscar(id);
  },
  consultar(id) {
    const s = repo.buscar(id);
    if (!s) throw new ErrorApp(404, 'No existe una solicitud con ese radicado.');
    return s;
  }
});
