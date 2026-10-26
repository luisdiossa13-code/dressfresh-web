// Cliente web de DressFresh (versión inicial): navegación por secciones y consumo de la API.
const $ = (s, r = document) => r.querySelector(s);
const moneda = (n) => '$' + Math.round(n).toLocaleString('es-CO');
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let sesion = null;
try { sesion = JSON.parse(localStorage.getItem('df_sesion')); } catch { sesion = null; }

function aviso(t) { const a = $('#aviso'); a.textContent = t; a.classList.add('ver'); setTimeout(() => a.classList.remove('ver'), 2500); }
async function api(ruta, opciones = {}) {
  const r = await fetch('/api' + ruta, {
    ...opciones,
    headers: { 'Content-Type': 'application/json', ...(sesion ? { Authorization: 'Bearer ' + sesion.token } : {}) },
    body: opciones.body ? JSON.stringify(opciones.body) : undefined
  });
  const datos = await r.json();
  if (!r.ok) { if (r.status === 401 && sesion) cerrarSesion(); throw new Error(datos.error || 'Error inesperado'); }
  return datos;
}

/* ---- Navegación ---- */
function mostrar() {
  const id = location.hash.slice(1) || 'catalogo';
  document.querySelectorAll('.vista').forEach((v) => (v.hidden = v.id !== id));
  document.querySelectorAll('nav a').forEach((a) => a.classList.toggle('activo', a.hash === '#' + id));
  if (id === 'carrito') cargarCarrito();
}
window.addEventListener('hashchange', mostrar);

/* ---- Módulo Catálogo ---- */
async function cargarCatalogo() {
  const q = new URLSearchParams({ busqueda: $('#busqueda').value, categoria: $('#categoria').value, promocion: $('#promo').checked ? '1' : '' });
  const lista = await api('/catalogo?' + q);
  $('#productos').innerHTML = lista.length ? lista.map((p) => `
    <article class="tarjeta"><small>${esc(p.categoria)} · ${esc(p.marca || '')}</small>
      <h3>${esc(p.nombre)} ${p.en_promocion ? '<span class="etiqueta">PROMO</span>' : ''}</h3>
      <span class="precio">${moneda(p.precio)}</span>${p.precio_anterior ? `<span class="antes">${moneda(p.precio_anterior)}</span>` : ''}
      <p><small>${p.stock} disponibles</small></p><button data-agregar="${p.id_producto}">Agregar al carrito</button></article>`).join('')
    : '<p>No hay productos con esos filtros.</p>';
}
$('#filtros').addEventListener('input', cargarCatalogo);
$('#filtros').addEventListener('submit', (e) => e.preventDefault());
$('#productos').addEventListener('click', async (e) => {
  const id = e.target.dataset.agregar; if (!id) return;
  if (!sesion) { aviso('Inicia sesión para usar el carrito.'); location.hash = '#cuenta'; return; }
  try { const c = await api('/carrito', { method: 'POST', body: { id_producto: Number(id), cantidad: 1 } }); contador(c); aviso('Producto agregado.'); }
  catch (err) { aviso(err.message); }
});

/* ---- Módulo Carrito ---- */
const contador = (c) => ($('#contador').textContent = c.items.reduce((s, i) => s + i.cantidad, 0));
async function cargarCarrito() {
  const cont = $('#itemsCarrito');
  if (!sesion) { cont.innerHTML = '<p>Inicia sesión para ver tu carrito.</p>'; return; }
  try {
    const c = await api('/carrito'); contador(c);
    cont.innerHTML = c.items.length ? `<table><tr><th>Producto</th><th>Cant.</th><th>Subtotal</th><th></th></tr>${c.items.map((i) =>
      `<tr><td>${esc(i.nombre)}</td><td>${i.cantidad}</td><td>${moneda(i.subtotal)}</td><td><button data-quitar="${i.id_producto}">Quitar</button></td></tr>`).join('')}
      <tr><th colspan="2">Total</th><th colspan="2">${moneda(c.total)}</th></tr></table>` : '<p>Tu carrito está vacío.</p>';
  } catch (err) { cont.innerHTML = `<p class="error">${esc(err.message)}</p>`; }
}
$('#itemsCarrito').addEventListener('click', async (e) => {
  if (!e.target.dataset.quitar) return;
  await api('/carrito/' + e.target.dataset.quitar, { method: 'DELETE' }); cargarCarrito();
});

/* ---- Módulo Cuentas de usuario ---- */
function pintarSesion() {
  $('#sesionActiva').hidden = !sesion; $('#formsCuenta').hidden = !!sesion;
  if (sesion) $('#nombreUsuario').textContent = sesion.usuario.nombre;
}
function cerrarSesion() { sesion = null; try { localStorage.removeItem('df_sesion'); } catch {} contador({ items: [] }); pintarSesion(); }
async function enviar(form, ruta, alExito) {
  const err = $('[data-error]', form); err.textContent = '';
  try { await alExito(await api(ruta, { method: 'POST', body: Object.fromEntries(new FormData(form)) })); }
  catch (e) { err.textContent = e.message; }
}
function iniciar(datos) {
  sesion = datos; try { localStorage.setItem('df_sesion', JSON.stringify(datos)); } catch {}
  pintarSesion(); aviso('Bienvenido, ' + datos.usuario.nombre); location.hash = '#catalogo';
}
$('#formLogin').addEventListener('submit', (e) => { e.preventDefault(); enviar(e.target, '/usuarios/login', iniciar); });
$('#formRegistro').addEventListener('submit', (e) => { e.preventDefault(); enviar(e.target, '/usuarios/registro', iniciar); });
$('#salir').addEventListener('click', cerrarSesion);

/* ---- Módulo PQRSF ---- */
$('#formPqrsf').addEventListener('submit', (e) => {
  e.preventDefault(); $('#okPqrsf').textContent = '';
  enviar(e.target, '/pqrsf', (r) => { $('#okPqrsf').textContent = `Solicitud recibida. Tu radicado es #${r.id_pqrsf}.`; e.target.reset(); });
});

/* ---- Inicio ---- */
(async () => {
  const cats = await api('/catalogo/categorias');
  $('#categoria').insertAdjacentHTML('beforeend', cats.map((c) => `<option>${esc(c)}</option>`).join(''));
  pintarSesion(); mostrar(); cargarCatalogo();
  if (sesion) api('/carrito').then(contador).catch(() => {});
})();
