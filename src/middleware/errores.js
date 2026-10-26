// Manejo de errores centralizado: nunca se exponen detalles internos al cliente.
function manejarErrores(err, req, res, next) {
  if (err.estado) return res.status(err.estado).json({ error: err.message, campo: err.campo });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON no válido.' });
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor.' });
}
const noEncontrado = (req, res) => res.status(404).json({ error: 'Ruta no encontrada.' });
module.exports = { manejarErrores, noEncontrado };
