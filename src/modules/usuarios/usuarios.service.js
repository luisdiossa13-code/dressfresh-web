// Capa de negocio: registro e inicio de sesión.
const { ErrorApp } = require('../../utils/errores');
const { v, primerError } = require('../../utils/validaciones');
const seg = require('../../utils/seguridad');

module.exports = (repo, config) => {
  const emitirToken = (u) => seg.crearToken({ id: u.id_usuario, rol: u.rol }, config.secretoToken, config.vigenciaTokenSeg);
  return {
    registrar({ nombre, correo, clave }) {
      const e = primerError([['nombre', v.nombre(nombre)], ['correo', v.correo(correo)], ['clave', v.clave(clave)]]);
      if (e) throw new ErrorApp(400, e.mensaje, e.campo);
      correo = correo.trim().toLowerCase();
      if (repo.buscarPorCorreo(correo)) throw new ErrorApp(409, 'Ya existe una cuenta con ese correo.', 'correo');
      const id = repo.crear({ nombre: nombre.trim().replace(/\s+/g, ' '), correo, claveHash: seg.hashClave(clave) });
      const usuario = repo.buscarPorId(id);
      return { usuario, token: emitirToken(usuario) };
    },
    ingresar({ correo, clave }) {
      const u = repo.buscarPorCorreo(String(correo ?? '').trim().toLowerCase());
      // Mismo mensaje para correo o clave incorrectos: no revela si la cuenta existe.
      if (!u || !seg.verificarClave(String(clave ?? ''), u.clave_hash)) throw new ErrorApp(401, 'Correo o contraseña incorrectos.');
      return { usuario: repo.buscarPorId(u.id_usuario), token: emitirToken(u) };
    },
    perfil(id) {
      const u = repo.buscarPorId(id);
      if (!u) throw new ErrorApp(404, 'Usuario no encontrado.');
      return u;
    }
  };
};
