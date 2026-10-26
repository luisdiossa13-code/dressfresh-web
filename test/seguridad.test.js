const test = require('node:test'); const assert = require('node:assert');
const s = require('../src/utils/seguridad');

test('hash de contraseña: no es texto plano y se verifica', () => {
  const h = s.hashClave('abc123');
  assert.notStrictEqual(h, 'abc123');
  assert.ok(s.verificarClave('abc123', h));
  assert.ok(!s.verificarClave('otra', h));
  assert.notStrictEqual(h, s.hashClave('abc123'));          // sal distinta cada vez
});
test('token: válido, alterado y vencido', () => {
  const t = s.crearToken({ id: 1 }, 'secreto', 60);
  assert.strictEqual(s.leerToken(t, 'secreto').id, 1);
  assert.strictEqual(s.leerToken(t, 'otro-secreto'), null);
  assert.strictEqual(s.leerToken(t.replace(/.$/, 'x'), 'secreto'), null);
  assert.strictEqual(s.leerToken(s.crearToken({ id: 1 }, 'secreto', -5), 'secreto'), null);
});
