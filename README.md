# DressFresh Web — versión inicial de 4 módulos

Aplicación web (Node.js + Express + SQLite) con el **inicio** de los módulos:
**Catálogo**, **Cuentas de usuario**, **Carrito de compras** y **PQRSF**.
Cada módulo tiene capas: `routes` (API) → `service` (reglas) → `repository` (SQL).

## Requisitos
Node.js 22.5 o superior (incluye SQLite, no hay que instalar base de datos).

## Ejecutar
```
npm install
npm start          # http://localhost:3000
npm test           # 16 pruebas unitarias / de módulo
```
Variables opcionales en `.env` (ver `.env.example`): `PORT`, `DB_FILE`, `TOKEN_SECRET`.
La base `data/dressfresh.db` se crea sola con datos de ejemplo.

## API
| Módulo | Rutas |
|---|---|
| Catálogo | GET /api/catalogo?categoria=&busqueda=&promocion=1 · GET /api/catalogo/categorias · GET /api/catalogo/:id |
| Usuarios | POST /api/usuarios/registro · POST /api/usuarios/login · GET /api/usuarios/perfil (sesión) |
| Carrito (sesión) | GET /api/carrito · POST /api/carrito · DELETE /api/carrito/:idProducto |
| PQRSF | POST /api/pqrsf · GET /api/pqrsf/:id |

## Pendiente (siguientes iteraciones)
CRUD de productos para el administrador, recuperar contraseña, pedido y pago, panel PQRSF.
