/* pagina-catalogo.js - Catálogo: tabla con Producto | Imagen | Descripción | Precio | Agregar */

function paginaCatalogo() {
  $("#tabla").innerHTML = PRODUCTOS.map((producto) => `
    <tr class="rev">
      <td><b>${producto.nombre}</b><br><small>${producto.nombreEn}</small></td>
      <td><img src="../imagenes/${producto.imagen}" alt="${producto.nombre}"></td>
      <td data-en="${producto.descripcionEn}">${producto.descripcion}</td>
      <td><b>${dinero(producto.precio)}</b></td>
      <td><button class="btn sm" data-add="${producto.id}" data-en="Add to Cart">Agregar al carrito</button></td>
    </tr>`).join("");
}
