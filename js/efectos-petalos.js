/* =====================================================================
   efectos-petalos.js - Pétalos que caen en el slider y en Misión / Visión / Gracias

   El estilo y el movimiento están en css/petalos.css
   ===================================================================== */

const COLORES_PETALOS = ["#b5546f", "#e8a5b8", "#f2a8bc", "#d27a93", "#c9a0dc"];

function activarPetalos() {
  $$(".slider, .mv").forEach((zona) => {
    const alto = zona.offsetHeight || 450;
    const cantidad = 9;

    for (let i = 0; i < cantidad; i++) {
      const petalo = document.createElement("span");
      petalo.className = "petalo";
      petalo.textContent = "✿";
      petalo.setAttribute("aria-hidden", "true");

      petalo.style.left = Math.random() * 100 + "%";
      petalo.style.fontSize = 14 + Math.random() * 18 + "px";
      petalo.style.color = COLORES_PETALOS[i % COLORES_PETALOS.length];
      petalo.style.animationDuration = 9 + Math.random() * 9 + "s";
      petalo.style.animationDelay = -Math.random() * 12 + "s"; // ya están a mitad de camino al cargar
      petalo.style.setProperty("--caida", alto + 60 + "px");

      zona.appendChild(petalo);
    }
  });
}
