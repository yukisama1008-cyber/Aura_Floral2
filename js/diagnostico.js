/* =====================================================================
   diagnostico.js - Revisa si el sitio funciona en ESTE computador y navegador
   (lo usa html/diagnostico.html)

   Comprueba: 1) el navegador  2) funciones que usa el sitio
              3) que carguen los archivos JS y CSS  4) imágenes  5) videos
   ===================================================================== */

// Listas de archivos del sitio. Si agregas archivos nuevos, agrégalos aquí también.
const DIAG_JS = ["datos-contacto", "productos", "utilidades", "idioma", "avisos", "carrito", "menu", "pie", "tarjeta-producto", "slider", "pagina-inicio", "pagina-productos", "pagina-catalogo", "pagina-proceso", "pagina-carrito", "pagina-contacto", "pagina-login", "efectos-aparicion", "efectos-petalos", "efectos-scroll"];
const DIAG_JS_ARRANQUE = "arranque";
const DIAG_CSS = ["animaciones", "aviso", "banner", "base", "botones", "contacto", "efectos-scroll", "encabezado", "estilo", "formularios", "menu", "mision-vision", "nosotros", "petalos", "pie", "productos", "responsive", "slider", "tablas", "valores", "variables", "video", "videos-secundarios"];
const DIAG_IMAGENES = ["equipo-helen-rincon.jpg", "equipo-mariana-gomez.jpg", "equipo-samuel-arce.jpg", "logo-aura-floral.jpg", "nosotros-manos-creando-flor.jpg", "producto-arreglos-decorativos.jpg", "producto-caja-regalo-floral.jpg", "producto-flores-limpiapipas.jpg", "producto-girasol-limpiapipas.jpg", "producto-kits-manualidades.jpg", "producto-llaveros-digitales.jpg", "producto-llaveros-limpiapipas.jpg", "producto-maceta-flores.jpg", "producto-mini-ramo.jpg", "producto-ramos-flores-eternas.jpg", "producto-ramos-personalizados.jpg", "producto-separadores-digitales.jpg", "slider-1-portada.jpg", "slider-2-ramos-personalizados.jpg", "slider-3-llaveros-limpiapipas.jpg", "video-proceso-portada.jpg"];
const DIAG_VIDEOS = ["video-proceso-elaboracion", "video-proceso-paso-1", "video-proceso-paso-2", "video-proceso-paso-3"];

let diagLineas = [];          // para el texto que se copia
let diagErrores = 0;
let diagAvisos = 0;
let diagErroresDeScript = []; // errores de código que ocurren al cargar los scripts

window.addEventListener("error", (evento) => {
  diagErroresDeScript.push({ archivo: evento.filename || "", mensaje: evento.message });
});

/* ---------- Mostrar resultados ---------- */
function diagGrupo(titulo) {
  const tabla = document.getElementById("diag-tabla");
  const cuerpo = document.createElement("tbody");
  cuerpo.innerHTML = '<tr class="diag-grupo"><th colspan="3">' + titulo + "</th></tr>";
  tabla.appendChild(cuerpo);
  diagLineas.push("", "== " + titulo + " ==");
  return cuerpo;
}

function diagFila(cuerpo, estado, nombre, detalle) {
  const icono = estado === "ok" ? "✅" : estado === "aviso" ? "⚠️" : "❌";
  if (estado === "mal") diagErrores++;
  if (estado === "aviso") diagAvisos++;

  const fila = document.createElement("tr");
  fila.innerHTML =
    '<td class="diag-estado">' + icono + "</td><td>" + nombre + '</td><td class="diag-detalle">' + (detalle || "") + "</td>";
  cuerpo.appendChild(fila);
  diagLineas.push(icono + " " + nombre + (detalle ? " - " + detalle : ""));
}

/* ---------- Cargas de prueba ---------- */
function diagProbarScript(nombre) {
  return new Promise((resolver) => {
    const antes = diagErroresDeScript.length;
    const script = document.createElement("script");
    script.src = "../js/" + nombre + ".js";
    script.onload = () => {
      const nuevos = diagErroresDeScript.slice(antes).filter((e) => e.archivo.indexOf(nombre + ".js") !== -1);
      resolver(nuevos.length ? { ok: false, motivo: "error de código: " + nuevos[0].mensaje } : { ok: true });
    };
    script.onerror = () => resolver({ ok: false, motivo: "no se encontró el archivo (revisa que se llame exactamente " + nombre + ".js y esté en la carpeta js/)" });
    document.body.appendChild(script);
  });
}

// arranque.js no se ejecuta aquí (armaría el sitio dentro de esta página): solo se comprueba que exista
function diagProbarExistencia(ruta, tipo) {
  return new Promise((resolver) => {
    const enlace = document.createElement("link");
    enlace.rel = "preload";
    enlace.as = tipo;
    enlace.href = ruta;
    const fin = setTimeout(() => resolver("dudoso"), 3000);
    enlace.onload = () => { clearTimeout(fin); resolver("ok"); };
    enlace.onerror = () => { clearTimeout(fin); resolver("mal"); };
    document.head.appendChild(enlace);
  });
}

function diagProbarEstilo(nombre) {
  return new Promise((resolver) => {
    const enlace = document.createElement("link");
    enlace.rel = "stylesheet";
    enlace.href = "../css/" + nombre + ".css";
    enlace.onload = () => resolver(true);
    enlace.onerror = () => resolver(false);
    document.head.appendChild(enlace);
  });
}

function diagProbarImagen(nombre) {
  return new Promise((resolver) => {
    const imagen = new Image();
    imagen.onload = () => resolver({ ok: true, ancho: imagen.naturalWidth, alto: imagen.naturalHeight });
    imagen.onerror = () => resolver({ ok: false });
    imagen.src = "../imagenes/" + nombre;
  });
}

function diagProbarVideo(nombre) {
  return new Promise((resolver) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    const fin = setTimeout(() => resolver({ ok: false, motivo: "no respondió" }), 6000);
    video.onloadedmetadata = () => { clearTimeout(fin); resolver({ ok: true, ancho: video.videoWidth, alto: video.videoHeight, segundos: Math.round(video.duration) }); };
    video.onerror = () => { clearTimeout(fin); resolver({ ok: false, motivo: "no se encontró o el navegador no puede reproducirlo" }); };
    video.src = "../videos/" + nombre + ".mp4";
  });
}

/* ---------- Revisión completa ---------- */
async function diagRevisar() {
  document.getElementById("diag-tabla").innerHTML = "";
  diagLineas = [];
  diagErrores = 0;
  diagAvisos = 0;
  diagErroresDeScript = [];

  // 1) Navegador
  let g = diagGrupo("1. Este computador y navegador");
  diagFila(g, "ok", "Navegador", navigator.userAgent);
  diagFila(g, "ok", "Pantalla", window.innerWidth + " x " + window.innerHeight + " px");
  diagFila(g, location.protocol === "file:" ? "ok" : "ok", "Cómo se abrió el sitio", location.protocol === "file:" ? "como archivo del computador" : "desde internet (" + location.protocol + ")");

  // 2) Funciones que usa el sitio
  g = diagGrupo("2. Funciones del navegador que usa el sitio");

  let guardado = false;
  try { localStorage.setItem("aura-prueba", "1"); localStorage.removeItem("aura-prueba"); guardado = true; } catch (e) { guardado = false; }
  diagFila(g, guardado ? "ok" : "aviso", "Guardado del carrito (localStorage)", guardado ? "funciona" : "está bloqueado: el sitio usa un respaldo y el carrito funciona igual en la misma pestaña");

  const soporta = (propiedad, valor) => !!(window.CSS && CSS.supports && CSS.supports(propiedad, valor));
  diagFila(g, soporta("animation-name", "x") ? "ok" : "mal", "Animaciones CSS", soporta("animation-name", "x") ? "funcionan" : "este navegador no las soporta");
  diagFila(g, soporta("aspect-ratio", "1 / 1") ? "ok" : "aviso", "Proporción de fotos y videos (aspect-ratio)", soporta("aspect-ratio", "1 / 1") ? "funciona" : "navegador antiguo: se usan alturas fijas");
  diagFila(g, soporta("backdrop-filter", "blur(2px)") || soporta("-webkit-backdrop-filter", "blur(2px)") ? "ok" : "aviso", "Efecto de cristal del encabezado", "solo es un detalle visual");
  diagFila(g, "IntersectionObserver" in window ? "ok" : "aviso", "Aparición al bajar (IntersectionObserver)", "IntersectionObserver" in window ? "funciona" : "no disponible: todo se muestra sin animar");
  diagFila(g, "fetch" in window ? "ok" : "mal", "Envío del formulario por correo (fetch)", "fetch" in window ? "funciona" : "no disponible");
  diagFila(g, navigator.onLine === false ? "aviso" : "ok", "Conexión a internet", navigator.onLine === false ? "sin conexión: no se enviarán correos ni se cargarán las fuentes" : "conectado");

  const reducir = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  diagFila(g, "ok", "Opción del sistema \"reducir animaciones\"", reducir ? "está activada, pero el sitio igual muestra sus animaciones" : "desactivada");

  const probadorVideo = document.createElement("video");
  const mp4 = probadorVideo.canPlayType && probadorVideo.canPlayType('video/mp4; codecs="avc1.42E01E"');
  diagFila(g, mp4 ? "ok" : "mal", "Video MP4 (H.264)", mp4 ? "este navegador puede reproducir tus videos" : "este navegador NO reproduce MP4");
  diagFila(g, document.fullscreenEnabled || document.webkitFullscreenEnabled ? "ok" : "aviso", "Pantalla completa del video", document.fullscreenEnabled || document.webkitFullscreenEnabled ? "disponible" : "no disponible (el video igual se ve)");

  // 3) Archivos JS (se cargan en orden)
  g = diagGrupo("3. Archivos de la carpeta js/");
  for (const nombre of DIAG_JS) {
    const r = await diagProbarScript(nombre);
    diagFila(g, r.ok ? "ok" : "mal", nombre + ".js", r.ok ? "" : r.motivo);
  }
  const arranque = await diagProbarExistencia("../js/" + DIAG_JS_ARRANQUE + ".js", "script");
  diagFila(g, arranque === "ok" ? "ok" : arranque === "dudoso" ? "aviso" : "mal", DIAG_JS_ARRANQUE + ".js", arranque === "ok" ? "" : arranque === "dudoso" ? "no se pudo comprobar en este navegador" : "no se encontró el archivo");

  // Datos principales
  g = diagGrupo("4. Datos del sitio");
  const datos = typeof DATOS_CONTACTO !== "undefined" ? DATOS_CONTACTO : null;
  diagFila(g, datos ? "ok" : "mal", "Datos de contacto (datos-contacto.js)", datos ? datos.telefonoVisible + " · " + datos.correo : "no se cargaron");
  const ej = datos && datos.emailjs;
  const ejListo = !!(ej && ej.serviceId && ej.templateId && ej.publicKey);
  diagFila(g, ejListo ? "ok" : "mal", "Claves de EmailJS (correo del formulario)", ejListo ? "las 3 claves están puestas" : "faltan claves en datos-contacto.js");
  diagFila(g, typeof PRODUCTOS !== "undefined" && PRODUCTOS.length ? "ok" : "mal", "Productos (productos.js)", typeof PRODUCTOS !== "undefined" ? PRODUCTOS.length + " productos" : "no se cargaron");
  diagFila(g, typeof MENU !== "undefined" ? "ok" : "mal", "Menú (menu.js)", typeof MENU !== "undefined" ? MENU.length + " pestañas" : "no se cargó");

  // 5) CSS
  g = diagGrupo("5. Estilos de la carpeta css/");
  for (const nombre of DIAG_CSS) {
    const ok = await diagProbarEstilo(nombre);
    diagFila(g, ok ? "ok" : "mal", nombre + ".css", ok ? "" : "no se encontró el archivo");
  }

  // 6) Imágenes
  g = diagGrupo("6. Imágenes de la carpeta imagenes/");
  for (const nombre of DIAG_IMAGENES) {
    const r = await diagProbarImagen(nombre);
    diagFila(g, r.ok ? "ok" : "mal", nombre, r.ok ? r.ancho + " x " + r.alto + " px" : "no se encontró o está dañada");
  }

  // 7) Videos
  g = diagGrupo("7. Videos de la carpeta videos/");
  for (const nombre of DIAG_VIDEOS) {
    const r = await diagProbarVideo(nombre);
    if (r.ok) {
      const forma = r.alto > r.ancho ? "vertical" : "horizontal";
      diagFila(g, "ok", nombre + ".mp4", forma + " " + r.ancho + " x " + r.alto + ", " + r.segundos + " s");
    } else {
      diagFila(g, "aviso", nombre + ".mp4", r.motivo + " (si aún no lo agregas, es normal)");
    }
  }

  // Resumen
  const resumen = document.getElementById("diag-resumen");
  if (diagErrores === 0 && diagAvisos === 0) {
    resumen.className = "diag-resumen bien";
    resumen.textContent = "✅ Todo bien: el sitio debería funcionar en este computador y navegador.";
  } else if (diagErrores === 0) {
    resumen.className = "diag-resumen aviso";
    resumen.textContent = "⚠️ El sitio funciona, con " + diagAvisos + " aviso(s). Revisa las filas con ⚠️.";
  } else {
    resumen.className = "diag-resumen mal";
    resumen.textContent = "❌ Hay " + diagErrores + " problema(s) que arreglar. Mira las filas con ❌.";
  }

  diagLineas.unshift("DIAGNÓSTICO DEL SITIO - " + new Date().toLocaleString(), resumen.textContent);
}

/* ---------- Botones ---------- */
document.getElementById("diag-repetir").onclick = () => location.reload();

document.getElementById("diag-copiar").onclick = () => {
  const texto = diagLineas.join("\n");
  const aviso = (mensaje) => { document.getElementById("diag-copiar").textContent = mensaje; };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(texto).then(() => aviso("¡Copiado!"), () => diagCopiarAntiguo(texto, aviso));
  } else {
    diagCopiarAntiguo(texto, aviso);
  }
};

// Forma de copiar para navegadores antiguos
function diagCopiarAntiguo(texto, aviso) {
  const area = document.createElement("textarea");
  area.value = texto;
  document.body.appendChild(area);
  area.select();
  try { document.execCommand("copy"); aviso("¡Copiado!"); } catch (error) { aviso("No se pudo copiar"); }
  document.body.removeChild(area);
}

diagRevisar();
