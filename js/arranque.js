/* =====================================================================
   arranque.js - Se ejecuta al final, cuando ya cargó todo lo demás

   Cada página tiene <body data-page="..."> y, según ese nombre,
   se llama a la función de esa página (si su archivo está cargado).

   Cada paso se ejecuta por separado: si uno falla, los demás siguen
   funcionando y el error se ve en la consola del navegador (tecla F12).
   ===================================================================== */

function ejecutar(nombre, funcion) {
  try {
    funcion();
  } catch (error) {
    console.error("Error en «" + nombre + "»:", error);
  }
}

// 1. Piezas comunes a todas las páginas
ejecutar("encabezado", crearEncabezado);
ejecutar("aviso", crearAviso);
ejecutar("pie de página", crearPie);
ejecutar("menú", activarMenu);
ejecutar("botón de idioma", activarBotonIdioma);
ejecutar("contador del carrito", actualizarContador);

// 2. La parte propia de esta página
const FUNCIONES_POR_PAGINA = {
  inicio: window.paginaInicio,
  productos: window.paginaProductos,
  catalogo: window.paginaCatalogo,
  proceso: window.paginaProceso,
  carrito: window.paginaCarrito,
  contacto: window.paginaContacto,
  login: window.paginaLogin,
};

const funcionDeLaPagina = FUNCIONES_POR_PAGINA[document.body.dataset.page];
if (funcionDeLaPagina) ejecutar("página " + document.body.dataset.page, funcionDeLaPagina);

// 3. Idioma y efectos
ejecutar("idioma", traducirPagina);
ejecutar("pétalos", activarPetalos);
ejecutar("aparición", activarAparicion);
ejecutar("efectos de scroll", activarEfectosScroll);
