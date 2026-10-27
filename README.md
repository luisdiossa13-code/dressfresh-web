# DressFresh Web - módulos integrados

Tienda virtual de moda multimarca. Esta versión integra cuatro módulos que comparten base de datos, sesión, validaciones y manejo de errores:

| Módulo | Qué hace |
|---|---|
| Catálogo | Lista, busca y filtra productos |
| Cuentas de usuario | Registro, inicio de sesión y perfil |
| Carrito de compras | Agrega, acumula y quita productos (con sesión) |
| PQRSF | Radica peticiones, quejas, reclamos, sugerencias y felicitaciones |

## Requisitos
Node.js 22.5 o superior (incluye SQLite; no hay que instalar base de datos).

## Ejecutar
```
npm install
npm start          # http://localhost:3000
npm test           # 16 pruebas automáticas
```
En Windows también se puede hacer doble clic en `iniciar.bat`.

## Estructura
- `src/` código del servidor (módulos por capas: routes, service, repository)
- `public/` interfaz web
- `test/` pruebas automáticas
- `base_de_datos/dressfresh_bd.sql` script de la base de datos MySQL
- `docs/` manual técnico e informe de módulos integrados

## Variables (opcional)
`PORT`, `DB_FILE`, `TOKEN_SECRET` (ver `.env.example`).

## Pendiente
Pedido y pago, administración de productos y panel de respuesta de PQRSF.
