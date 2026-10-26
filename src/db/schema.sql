-- Esquema simplificado del modelo de DressFresh (SQLite en esta versión; el modelo MySQL completo está en dressfresh_bd.sql)
CREATE TABLE IF NOT EXISTS categoria (
  id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre       TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS producto (
  id_producto     INTEGER PRIMARY KEY AUTOINCREMENT,
  id_categoria    INTEGER NOT NULL REFERENCES categoria(id_categoria),
  nombre          TEXT NOT NULL,
  marca           TEXT,
  precio          REAL NOT NULL CHECK (precio >= 0),
  precio_anterior REAL,
  stock           INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  en_promocion    INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS usuario (
  id_usuario  INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre      TEXT NOT NULL,
  correo      TEXT NOT NULL UNIQUE,
  clave_hash  TEXT NOT NULL,            -- nunca se guarda la contraseña en texto plano
  rol         TEXT NOT NULL DEFAULT 'cliente' CHECK (rol IN ('cliente','admin')),
  creado_en   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS carrito_item (
  id_usuario  INTEGER NOT NULL REFERENCES usuario(id_usuario),
  id_producto INTEGER NOT NULL REFERENCES producto(id_producto),
  cantidad    INTEGER NOT NULL CHECK (cantidad > 0),
  PRIMARY KEY (id_usuario, id_producto)
);
CREATE TABLE IF NOT EXISTS pqrsf (
  id_pqrsf   INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo       TEXT NOT NULL CHECK (tipo IN ('peticion','queja','reclamo','sugerencia','felicitacion')),
  nombre     TEXT NOT NULL,
  correo     TEXT NOT NULL,
  mensaje    TEXT NOT NULL,
  estado     TEXT NOT NULL DEFAULT 'recibida',
  creado_en  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
