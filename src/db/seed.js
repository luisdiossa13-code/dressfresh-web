// Datos de ejemplo para el catálogo (solo si la tabla está vacía).
const productos = [
  ['Camisas', 'Camisa Oxford Slim', 'Zara', 129900, null, 12, 0],
  ['Camisas', 'Camisa Lino Beige', 'Mango', 99900, 129900, 8, 1],
  ['Jeans', 'Jean Recto Azul', 'Levi\'s', 189900, null, 15, 0],
  ['Tenis', 'Tenis Urbanos Blancos', 'Nike', 349900, 399900, 6, 1],
  ['Tenis', 'Tenis Running Negro', 'Adidas', 299900, null, 10, 0],
  ['Perfumes', 'Perfume Oud Nocturno', 'Dior', 459900, null, 5, 0],
  ['Relojes', 'Reloj Clásico Dorado', 'Casio', 219900, 249900, 4, 1]
];
function sembrar(db) {
  if (db.prepare('SELECT COUNT(*) n FROM producto').get().n > 0) return;
  const cat = db.prepare('INSERT OR IGNORE INTO categoria(nombre) VALUES (?)');
  const id = db.prepare('SELECT id_categoria FROM categoria WHERE nombre = ?');
  const ins = db.prepare('INSERT INTO producto(id_categoria,nombre,marca,precio,precio_anterior,stock,en_promocion) VALUES (?,?,?,?,?,?,?)');
  for (const [c, ...r] of productos) { cat.run(c); ins.run(id.get(c).id_categoria, ...r); }
}
module.exports = { sembrar };
