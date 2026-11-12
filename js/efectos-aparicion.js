/* =====================================================================
   efectos-aparicion.js - Los elementos aparecen suavemente al bajar

   Marca con la clase "rev" lo que debe animarse, les da un pequeño
   retraso escalonado y los muestra cuando entran en pantalla.
   La animación en sí está en css/animaciones.css (sección 14).
   ===================================================================== */

// Elementos que se animan al aparecer (además de los que ya traen la clase "rev")
const SE_ANIMAN_AL_BAJAR = [
  "main .titulo",
  "main .dos > *",
  "main .tw",
  "main .video-caja",
  "main form.f",
  ".valores > div",
  ".mv .en",
  "main > h3",
];

function activarAparicion() {
  try {
    prepararAparicion();
  } catch (error) {
    // Si algo falla, se muestra todo sin animación (nunca queda contenido oculto)
    console.error("Aparición al bajar:", error);
    $$(".rev").forEach((elemento) => elemento.classList.add("v"));
  }
}

function prepararAparicion() {
  SE_ANIMAN_AL_BAJAR.forEach((selector) => {
    $$(selector).forEach((elemento) => elemento.classList.add("rev"));
  });

  // Retraso escalonado: cada hermano espera un poquito más que el anterior
  const contadores = new Map();
  $$(".rev").forEach((elemento) => {
    const posicion = contadores.get(elemento.parentElement) || 0;
    elemento.style.setProperty("--d", (posicion % 4) * 100 + "ms");
    contadores.set(elemento.parentElement, posicion + 1);
  });

  // Si el navegador es muy antiguo, simplemente se muestra todo
  if (!("IntersectionObserver" in window)) {
    $$(".rev").forEach((elemento) => elemento.classList.add("v"));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("v");
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  $$(".rev").forEach((elemento) => observador.observe(elemento));
}
