/* pagina-proceso.js - Proceso: botón para ver el video en pantalla completa */

// Mide cada video pequeño y le da la forma real del archivo (vertical u horizontal)
function ajustarVideosPequenos() {
  $$(".video-mini").forEach((video) => {
    const ajustar = () => {
      if (video.videoWidth && video.videoHeight) {
        video.style.aspectRatio = video.videoWidth + " / " + video.videoHeight;
      }
    };

    if (video.readyState >= 1) ajustar();
    video.addEventListener("loadedmetadata", ajustar);
  });
}

function paginaProceso() {
  ajustarVideosPequenos();

  const video = $(".video");
  const boton = $("#btn-video-completo");

  boton.onclick = () => {
    // Cada navegador usa un nombre distinto para la pantalla completa
    const pedirPantallaCompleta =
      video.requestFullscreen ||
      video.webkitRequestFullscreen ||
      video.webkitEnterFullscreen ||   // iPhone
      video.msRequestFullscreen;

    if (pedirPantallaCompleta) pedirPantallaCompleta.call(video);
  };
}
