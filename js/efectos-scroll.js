/* =====================================================================
   efectos-scroll.js - Efectos al desplazarse por la página

   1. Barra de progreso rosada arriba
   2. Encabezado que se encoge al bajar
   3. Botón "subir"
   Los estilos están en css/efectos-scroll.css
   ===================================================================== */

function activarEfectosScroll() {
  document.body.insertAdjacentHTML("afterbegin", '<div class="progreso" aria-hidden="true"></div>');
  document.body.insertAdjacentHTML("beforeend", '<button class="subir" aria-label="Subir / Back to top">↑</button>');

  const barra = $(".progreso");
  const encabezado = $(".top");
  const botonSubir = $(".subir");

  botonSubir.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });

  function alDesplazar() {
    const recorrido = document.documentElement.scrollHeight - window.innerHeight;
    const avance = recorrido > 0 ? (window.scrollY / recorrido) * 100 : 0;

    barra.style.width = avance + "%";
    encabezado.classList.toggle("scrolled", window.scrollY > 40);
    botonSubir.classList.toggle("on", window.scrollY > 400);
  }

  window.addEventListener("scroll", alDesplazar, { passive: true });
  alDesplazar();
}
