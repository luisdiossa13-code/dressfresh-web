-- =====================================================================
-- DressFresh - Script de la base de datos (modelo físico)
-- Motor: MySQL 8 (compatible con MySQL Workbench)
-- Versión: 1.0 - primeros pasos del proyecto
-- =====================================================================

DROP DATABASE IF EXISTS dressfresh;
CREATE DATABASE dressfresh CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dressfresh;

-- ---------------------------------------------------------------------
-- 1. CATEGORIA: tipos de producto (camisas, tenis, perfumes, etc.)
-- ---------------------------------------------------------------------
CREATE TABLE categoria (
  id_categoria INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre       VARCHAR(50)  NOT NULL,
  PRIMARY KEY (id_categoria),
  UNIQUE KEY uq_categoria_nombre (nombre)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 2. PRODUCTO: artículos que se venden en la tienda
--    en_promocion = 1 -> aparece en la sección de promociones
-- ---------------------------------------------------------------------
CREATE TABLE producto (
  id_producto     INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  id_categoria    INT UNSIGNED  NOT NULL,
  nombre          VARCHAR(100)  NOT NULL,
  marca           VARCHAR(60)   NULL,
  precio          DECIMAL(10,2) NOT NULL,
  precio_anterior DECIMAL(10,2) NULL,
  stock           INT UNSIGNED  NOT NULL DEFAULT 0,
  en_promocion    TINYINT(1)    NOT NULL DEFAULT 0,
  fecha_creacion  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_producto),
  CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria)
    REFERENCES categoria (id_categoria) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT ck_producto_precio CHECK (precio >= 0),
  INDEX idx_producto_categoria (id_categoria),
  INDEX idx_producto_nombre (nombre)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 3. USUARIO: clientes y administradores (rol)
--    clave_hash guarda la contraseña CIFRADA, nunca en texto plano
-- ---------------------------------------------------------------------
CREATE TABLE usuario (
  id_usuario     INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre         VARCHAR(100) NOT NULL,
  correo         VARCHAR(120) NOT NULL,
  clave_hash     VARCHAR(255) NOT NULL,
  rol            ENUM('cliente','administrador') NOT NULL DEFAULT 'cliente',
  fecha_registro TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY uq_usuario_correo (correo)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 4. PEDIDO: compra hecha desde el carrito
-- ---------------------------------------------------------------------
CREATE TABLE pedido (
  id_pedido  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario INT UNSIGNED NOT NULL,
  fecha      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  subtotal   DECIMAL(10,2) NOT NULL DEFAULT 0,
  envio      DECIMAL(10,2) NOT NULL DEFAULT 0,
  total      DECIMAL(10,2) NOT NULL DEFAULT 0,
  estado     ENUM('pendiente','pagado','enviado','cancelado') NOT NULL DEFAULT 'pendiente',
  PRIMARY KEY (id_pedido),
  CONSTRAINT fk_pedido_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_pedido_usuario (id_usuario)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 5. DETALLE_PEDIDO: productos de cada pedido (relación N a N)
-- ---------------------------------------------------------------------
CREATE TABLE detalle_pedido (
  id_pedido       INT UNSIGNED  NOT NULL,
  id_producto     INT UNSIGNED  NOT NULL,
  cantidad        INT UNSIGNED  NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id_pedido, id_producto),
  CONSTRAINT fk_detalle_pedido FOREIGN KEY (id_pedido)
    REFERENCES pedido (id_pedido) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_detalle_producto FOREIGN KEY (id_producto)
    REFERENCES producto (id_producto) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT ck_detalle_cantidad CHECK (cantidad > 0)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 6. PAGO: pago en línea de un pedido (no se guardan datos de tarjeta)
-- ---------------------------------------------------------------------
CREATE TABLE pago (
  id_pago   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_pedido INT UNSIGNED NOT NULL,
  metodo    ENUM('tarjeta','pse','contra_entrega') NOT NULL,
  monto     DECIMAL(10,2) NOT NULL,
  estado    ENUM('aprobado','rechazado','pendiente') NOT NULL DEFAULT 'pendiente',
  fecha     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_pago),
  CONSTRAINT fk_pago_pedido FOREIGN KEY (id_pedido)
    REFERENCES pedido (id_pedido) ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_pago_pedido (id_pedido)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 7. PQRSF: peticiones, quejas, reclamos, sugerencias y felicitaciones
--    id_usuario es opcional (se puede escribir sin tener cuenta)
-- ---------------------------------------------------------------------
CREATE TABLE pqrsf (
  id_pqrsf   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario INT UNSIGNED NULL,
  tipo       ENUM('peticion','queja','reclamo','sugerencia','felicitacion') NOT NULL,
  nombre     VARCHAR(100) NOT NULL,
  correo     VARCHAR(120) NOT NULL,
  mensaje    TEXT         NOT NULL,
  estado     ENUM('recibida','en_proceso','resuelta') NOT NULL DEFAULT 'recibida',
  fecha      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_pqrsf),
  CONSTRAINT fk_pqrsf_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================================================================
-- DATOS DE EJEMPLO
-- =====================================================================
INSERT INTO categoria (nombre) VALUES
 ('Camisas'),('Camisetas'),('Pantalones'),('Sudaderas'),('Shorts'),
 ('Ropa interior'),('Tenis'),('Zapatos'),('Perfumes'),('Bolsos');

INSERT INTO producto (id_categoria, nombre, marca, precio, precio_anterior, stock, en_promocion) VALUES
 (1,'Camisa Oxford Clásica','Arrow',89000,NULL,15,0),
 (2,'Camiseta Básica Blanca','Basic',39000,49000,30,1),
 (3,'Jean Slim Azul','Levi''s',129000,NULL,12,0),
 (4,'Sudadera con Capucha','Nike',149000,179000,8,1),
 (5,'Short Deportivo','Adidas',59000,NULL,20,0),
 (6,'Pack Bóxer x3','Punto Blanco',45000,NULL,25,0),
 (7,'Tenis Urbanos Blancos','Adidas',219000,259000,10,1),
 (8,'Zapato Casual Cuero','Hush Puppies',199000,NULL,6,0),
 (9,'Perfume Fresh 100 ml','Carolina Herrera',289000,NULL,9,0),
 (10,'Bolso Bandolera','Totto',99000,NULL,14,0);

-- Contraseñas de ejemplo: marcador, NO son claves reales (en la app se guardará el hash)
INSERT INTO usuario (nombre, correo, clave_hash, rol) VALUES
 ('Administrador DressFresh','admin@dressfresh.co','HASH_DE_EJEMPLO_ADMIN','administrador'),
 ('Cliente de Prueba','cliente@correo.com','HASH_DE_EJEMPLO_CLIENTE','cliente');

INSERT INTO pedido (id_usuario, subtotal, envio, total, estado) VALUES (2, 128000, 12000, 140000, 'pagado');
INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario) VALUES
 (1, 1, 1, 89000),
 (1, 2, 1, 39000);
INSERT INTO pago (id_pedido, metodo, monto, estado) VALUES (1, 'tarjeta', 140000, 'aprobado');

INSERT INTO pqrsf (id_usuario, tipo, nombre, correo, mensaje) VALUES
 (2,'sugerencia','Cliente de Prueba','cliente@correo.com','Me gustaría ver más tallas disponibles.');

-- =====================================================================
-- CONSULTAS DE VERIFICACIÓN (opcionales)
-- =====================================================================
-- SELECT p.nombre, c.nombre AS categoria, p.precio FROM producto p JOIN categoria c USING (id_categoria);
-- SELECT * FROM producto WHERE en_promocion = 1;
-- SELECT u.nombre, pe.id_pedido, pe.total, pe.estado FROM pedido pe JOIN usuario u USING (id_usuario);
