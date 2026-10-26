const test = require('node:test'); const assert = require('node:assert');
const { v } = require('../src/utils/validaciones');

test('nombre: válidos e inválidos', () => {
  assert.strictEqual(v.nombre('Laura Gómez'), '');
  assert.strictEqual(v.nombre("Ana-María O'Neil"), '');
  assert.match(v.nombre(''), /obligatorio/);
  assert.match(v.nombre('Al'), /al menos 3/);
  assert.match(v.nombre('Luis3'), /Solo se permiten letras/);
  assert.match(v.nombre('a'.repeat(61)), /60/);
});
test('correo', () => {
  assert.strictEqual(v.correo('a@dominio.com'), '');
  assert.match(v.correo('sin-arroba'), /válido/);
  assert.match(v.correo('a@dominio'), /válido/);
});
test('clave', () => {
  assert.strictEqual(v.clave('abc123'), '');
  assert.match(v.clave('abc'), /al menos 6/);
  assert.match(v.clave('ab c123'), /espacios/);
});
test('mensaje y tipo PQRSF', () => {
  assert.strictEqual(v.mensaje('Mensaje de prueba'), '');
  assert.match(v.mensaje('corto'), /al menos 10/);
  assert.match(v.mensaje('<script>alert(1)</script>'), /< y >/);
  assert.strictEqual(v.tipoPqrsf('queja'), '');
  assert.match(v.tipoPqrsf('otro'), /válido/);
});
test('cantidad', () => {
  assert.strictEqual(v.cantidad(3), '');
  assert.match(v.cantidad(0), /entre 1 y 10/);
  assert.match(v.cantidad('2'), /entre 1 y 10/);
});
