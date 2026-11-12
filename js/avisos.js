/* =====================================================================
   avisos.js - Mensaje pequeño que aparece abajo a la derecha
   ===================================================================== */

function crearAviso() {
  document.body.insertAdjacentHTML("beforeend", '<div class="toast" role="status"></div>');
}

function mostrarAviso(texto) {
  const aviso = $(".toast");
  aviso.textContent = texto;
  aviso.classList.add("on");
  setTimeout(() => aviso.classList.remove("on"), 1800);
}
