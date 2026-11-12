/* =====================================================================
   slider.js - Diapositivas de la página de inicio

   Cambian solas cada 5,5 segundos (se detienen si pones el mouse encima).
   ===================================================================== */

function iniciarSlider() {
  const slider = $(".slider");
  const diapositivas = $$(".slide");
  const contenedorPuntos = $(".dots");
  let actual = 0;
  let pausado = false;

  // Crea un puntito por cada diapositiva
  contenedorPuntos.innerHTML = diapositivas
    .map((_, numero) => `<i data-n="${numero}"></i>`)
    .join("");

  function mostrar(numero) {
    actual = numero;
    diapositivas.forEach((d, i) => d.classList.toggle("on", i === numero));
    $$("i", contenedorPuntos).forEach((p, i) => p.classList.toggle("on", i === numero));
  }

  // Clic en un puntito: va a esa diapositiva
  contenedorPuntos.onclick = (evento) => {
    if (evento.target.dataset.n) mostrar(Number(evento.target.dataset.n));
  };

  // Pausa mientras el mouse está encima
  slider.addEventListener("mouseenter", () => (pausado = true));
  slider.addEventListener("mouseleave", () => (pausado = false));

  mostrar(0);
  setInterval(() => {
    if (!pausado) mostrar((actual + 1) % diapositivas.length);
  }, 5500);
}
