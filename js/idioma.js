/* =====================================================================
   idioma.js - Cambio de idioma (español / inglés)

   Los textos en inglés están en el atributo data-en de cada etiqueta.
   ===================================================================== */

let idioma = Almacen.leer("idioma", "es");

function traducirPagina() {
  // Cambia el contenido de todo elemento que tenga data-en
  $$("[data-en]").forEach((elemento) => {
    if (elemento.dataset.es === undefined) {
      elemento.dataset.es = elemento.innerHTML; // guarda el texto original en español
    }
    elemento.innerHTML = idioma === "en" ? elemento.dataset.en : elemento.dataset.es;
  });

  // Cambia el texto de ayuda (placeholder) de los campos que tengan data-pen
  $$("[data-pen]").forEach((campo) => {
    if (campo.dataset.pes === undefined) {
      campo.dataset.pes = campo.placeholder;
    }
    campo.placeholder = idioma === "en" ? campo.dataset.pen : campo.dataset.pes;
  });

  document.documentElement.lang = idioma;
  $("#btn-idioma").textContent = idioma === "en" ? "ES" : "EN";
}

// Botón EN / ES del encabezado: alterna entre español e inglés
function activarBotonIdioma() {
  $("#btn-idioma").onclick = () => {
    idioma = idioma === "en" ? "es" : "en";
    Almacen.guardar("idioma", idioma);
    traducirPagina();
  };
}
