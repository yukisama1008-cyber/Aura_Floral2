/* pagina-inicio.js - Inicio: slider + 3 productos destacados */

function paginaInicio() {
  iniciarSlider();
  $("#dest").innerHTML = PRODUCTOS.slice(0, 3).map(crearTarjeta).join("");
}
