/* =====================================================================
   tarjeta-producto.js - Tarjeta de un producto (la usan Inicio y Productos)
   ===================================================================== */

function crearTarjeta(producto) {
  return `
    <article class="card rev">
      <img src="../imagenes/${producto.imagen}" alt="${producto.nombre}" loading="lazy">
      <h3>${producto.nombre}</h3>
      <small>${producto.nombreEn}</small>
      <p data-en="${producto.descripcionEn}">${producto.descripcion}</p>
      <small data-en="${producto.detalleEn}">${producto.detalle}</small>
      <div class="pr">${dinero(producto.precio)}</div>
      <button class="btn sm" data-add="${producto.id}" data-en="Add to Cart">Agregar al carrito</button>
    </article>`;
}
