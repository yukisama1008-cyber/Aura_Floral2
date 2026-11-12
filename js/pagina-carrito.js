/* pagina-carrito.js - Carrito: dibuja la tabla con los productos agregados */

function dibujarCarrito() {
  const carrito = leerCarrito();
  const ids = Object.keys(carrito).filter((id) => PRODUCTOS.some((p) => p.id == id)); // ignora productos que ya no existan
  let total = 0;

  if (ids.length === 0) {
    // Carrito vacío
    $("#items").innerHTML = `
      <tr>
        <td colspan="5" data-en="Your cart is empty. Visit our Products page!">
          Tu carrito está vacío. ¡Visita la página de Productos!
        </td>
      </tr>`;
  } else {
    // Una fila por producto, con botones − + y Eliminar
    $("#items").innerHTML = ids.map((id) => {
      const producto = PRODUCTOS.find((p) => p.id == id);
      const subtotal = producto.precio * carrito[id];
      total += subtotal;

      return `
        <tr>
          <td><b>${producto.nombre}</b><br><small>${producto.nombreEn}</small></td>
          <td>${dinero(producto.precio)}</td>
          <td class="q">
            <button data-menos="${id}" aria-label="-">−</button>
            ${carrito[id]}
            <button data-mas="${id}" aria-label="+">+</button>
          </td>
          <td>${dinero(subtotal)}</td>
          <td><button class="btn sm" data-borrar="${id}" data-en="Remove">Eliminar</button></td>
        </tr>`;
    }).join("");
  }

  $("#total").textContent = dinero(total);
  $("#buy").style.display = ids.length ? "" : "none"; // oculta "Comprar" si está vacío
  actualizarContador();
  traducirPagina();
}

function paginaCarrito() {
  dibujarCarrito();
}
