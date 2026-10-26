// Ensambla la aplicación: middlewares, módulos (repositorio → servicio → rutas) y archivos estáticos.
const path = require('path');
const express = require('express');
const config = require('./config/config');
const { abrirBD } = require('./db/conexion');
const { sembrar } = require('./db/seed');
const { cabecerasSeguras, limitador, requiereSesion } = require('./middleware/seguridad');
const { manejarErrores, noEncontrado } = require('./middleware/errores');

function crearApp({ archivoBD = config.archivoBD, cfg = config } = {}) {
  const db = abrirBD(archivoBD);
  sembrar(db);
  const sesion = requiereSesion(cfg.secretoToken);

  const catalogo = require('./modules/catalogo/catalogo.service')(require('./modules/catalogo/catalogo.repository')(db));
  const usuarios = require('./modules/usuarios/usuarios.service')(require('./modules/usuarios/usuarios.repository')(db), cfg);
  const carrito = require('./modules/carrito/carrito.service')(require('./modules/carrito/carrito.repository')(db));
  const pqrsf = require('./modules/pqrsf/pqrsf.service')(require('./modules/pqrsf/pqrsf.repository')(db));

  const app = express();
  app.set('trust proxy', false);
  app.use(cabecerasSeguras, limitador(cfg.limitePeticionesPorMinuto), express.json({ limit: '10kb' }));
  app.use('/api/catalogo', require('./modules/catalogo/catalogo.routes')(catalogo));
  app.use('/api/usuarios', require('./modules/usuarios/usuarios.routes')(usuarios, sesion));
  app.use('/api/carrito', require('./modules/carrito/carrito.routes')(carrito, sesion));
  app.use('/api/pqrsf', require('./modules/pqrsf/pqrsf.routes')(pqrsf));
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(noEncontrado);
  app.use(manejarErrores);
  return app;
}
module.exports = { crearApp };
