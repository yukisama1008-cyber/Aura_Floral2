/* pagina-productos.js - Productos: tarjetas de los 12 productos */

function paginaProductos() {
  $("#lista").innerHTML = PRODUCTOS.map(crearTarjeta).join("");
}
