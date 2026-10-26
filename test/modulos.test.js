// Pruebas de los 4 módulos con la aplicación real y una base de datos en memoria.
const test = require('node:test'); const assert = require('node:assert');
const { crearApp } = require('../src/app');

let servidor, base;
test.before(async () => {
  servidor = crearApp({ archivoBD: ':memory:' }).listen(0);
  await new Promise((r) => servidor.once('listening', r));
  base = `http://127.0.0.1:${servidor.address().port}/api`;
});
test.after(() => servidor.close());

async function llamar(ruta, { metodo = 'GET', cuerpo, token } = {}) {
  const r = await fetch(base + ruta, { method: metodo, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: cuerpo ? JSON.stringify(cuerpo) : undefined });
  return { estado: r.status, datos: await r.json() };
}
const registro = (correo = 'laura@correo.com') => llamar('/usuarios/registro', { metodo: 'POST', cuerpo: { nombre: 'Laura Gómez', correo, clave: 'abc123' } });

test('Catálogo: lista, filtra y detalla', async () => {
  const todos = await llamar('/catalogo'); assert.strictEqual(todos.datos.length, 7);
  const promo = await llamar('/catalogo?promocion=1'); assert.ok(promo.datos.every((p) => p.en_promocion === 1));
  const tenis = await llamar('/catalogo?categoria=Tenis'); assert.strictEqual(tenis.datos.length, 2);
  const buscar = await llamar('/catalogo?busqueda=nike'); assert.strictEqual(buscar.datos[0].marca, 'Nike');
  assert.strictEqual((await llamar('/catalogo/1')).datos.categoria, 'Camisas');
  assert.strictEqual((await llamar('/catalogo/999')).estado, 404);
  assert.strictEqual((await llamar('/catalogo/abc')).estado, 400);
});
test('Catálogo: texto con SQL se trata como dato, no como código', async () => {
  const r = await llamar("/catalogo?busqueda=' OR 1=1 --"); assert.strictEqual(r.estado, 200); assert.strictEqual(r.datos.length, 0);
});
test('Usuarios: registro, duplicado, login y perfil', async () => {
  const ok = await registro(); assert.strictEqual(ok.estado, 201); assert.ok(ok.datos.token);
  assert.strictEqual((await registro()).estado, 409);
  assert.strictEqual((await llamar('/usuarios/login', { metodo: 'POST', cuerpo: { correo: 'laura@correo.com', clave: 'mala' } })).estado, 401);
  const lg = await llamar('/usuarios/login', { metodo: 'POST', cuerpo: { correo: 'LAURA@correo.com', clave: 'abc123' } });
  assert.strictEqual(lg.estado, 200);
  const p = await llamar('/usuarios/perfil', { token: lg.datos.token });
  assert.strictEqual(p.datos.correo, 'laura@correo.com'); assert.strictEqual(p.datos.clave_hash, undefined);
});
test('Usuarios: datos inválidos devuelven 400 con el campo', async () => {
  const r = await llamar('/usuarios/registro', { metodo: 'POST', cuerpo: { nombre: 'Lu1', correo: 'x', clave: '1' } });
  assert.strictEqual(r.estado, 400); assert.strictEqual(r.datos.campo, 'nombre');
});
test('Seguridad: rutas protegidas exigen sesión y rechazan tokens falsos', async () => {
  assert.strictEqual((await llamar('/carrito')).estado, 401);
  assert.strictEqual((await llamar('/carrito', { token: 'falso.token' })).estado, 401);
});
test('Carrito: agregar, acumular, límites y quitar', async () => {
  const { datos: { token } } = await registro('carrito@correo.com');
  const add = (id, cantidad) => llamar('/carrito', { metodo: 'POST', cuerpo: { id_producto: id, cantidad }, token });
  let c = await add(2, 2); assert.strictEqual(c.datos.total, 99900 * 2);
  c = await add(2, 1); assert.strictEqual(c.datos.items[0].cantidad, 3);
  assert.strictEqual((await add(2, 0)).estado, 400);
  assert.strictEqual((await add(999, 1)).estado, 404);
  assert.strictEqual((await add(7, 5)).estado, 409);                 // stock de 4
  const q = await llamar('/carrito/2', { metodo: 'DELETE', token }); assert.strictEqual(q.datos.items.length, 0);
});
test('Carrito: cada usuario ve solo su carrito', async () => {
  const a = (await registro('a@correo.com')).datos.token, b = (await registro('b@correo.com')).datos.token;
  await llamar('/carrito', { metodo: 'POST', cuerpo: { id_producto: 1, cantidad: 1 }, token: a });
  assert.strictEqual((await llamar('/carrito', { token: b })).datos.items.length, 0);
});
test('PQRSF: radica, consulta y valida', async () => {
  const ok = await llamar('/pqrsf', { metodo: 'POST', cuerpo: { tipo: 'sugerencia', nombre: 'Ana Ruiz', correo: 'ana@correo.com', mensaje: 'Más tallas en las camisas, por favor.' } });
  assert.strictEqual(ok.estado, 201); assert.strictEqual(ok.datos.estado, 'recibida');
  assert.strictEqual((await llamar('/pqrsf/' + ok.datos.id_pqrsf)).datos.tipo, 'sugerencia');
  assert.strictEqual((await llamar('/pqrsf', { metodo: 'POST', cuerpo: { tipo: 'queja', nombre: 'Ana', correo: 'a@b.co', mensaje: 'corto' } })).estado, 400);
  assert.strictEqual((await llamar('/pqrsf/9999')).estado, 404);
});
test('Cabeceras de seguridad presentes', async () => {
  const r = await fetch(base + '/catalogo');
  assert.strictEqual(r.headers.get('x-content-type-options'), 'nosniff'); assert.strictEqual(r.headers.get('x-powered-by'), null);
});
