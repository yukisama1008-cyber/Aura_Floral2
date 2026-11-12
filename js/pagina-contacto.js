/* =====================================================================
   pagina-contacto.js - Contacto: tarjetas de datos + formulario

   Los datos (teléfono, correo, redes) salen de js/datos-contacto.js
   ===================================================================== */

// Dibuja las tarjetas de contacto: WhatsApp, correo, Instagram, TikTok y ubicación
function dibujarDatosContacto() {
  const d = datosContacto();

  const filas = [
    { icono: "📱", es: "WhatsApp / Teléfono", en: "WhatsApp / Phone", texto: d.telefonoVisible, url: enlaceWhatsApp(), externo: true },
    { icono: "✉️", es: "Correo electrónico",  en: "Email",            texto: d.correo,           url: "mailto:" + d.correo },
    { icono: "📷", es: "Instagram",           en: "Instagram",        texto: d.instagram.usuario, url: d.instagram.url, externo: true },
    { icono: "🎵", es: "TikTok",              en: "TikTok",           texto: d.tiktok.usuario,    url: d.tiktok.url, externo: true },
    { icono: "📍", es: "Ubicación",           en: "Location",         texto: d.ubicacion },
  ];

  $("#datos-contacto").innerHTML = filas.map((fila) => {
    const contenido = `
      <span class="dato-icono" aria-hidden="true">${fila.icono}</span>
      <span>
        <b data-en="${fila.en}">${fila.es}</b>
        <small>${fila.texto}</small>
      </span>`;

    // Con enlace (se puede tocar) o sin enlace (solo texto)
    return fila.url
      ? `<a class="dato rev" href="${fila.url}" ${fila.externo ? 'target="_blank" rel="noopener"' : ""}>${contenido}</a>`
      : `<div class="dato rev">${contenido}</div>`;
  }).join("");
}

/* ---------------------------------------------------------------------
   Envío del formulario
   1. Por correo: usa el servicio gratuito EmailJS (emailjs.com). No necesita
      servidor ni publicar el sitio. Se configura una sola vez con los 3 datos
      de datosContacto().emailjs (ver COMO-CONFIGURAR-EL-CORREO.txt).
   2. Por WhatsApp: abre un chat con el mensaje ya escrito.
   --------------------------------------------------------------------- */

// Manda los datos al correo del negocio (lanza un error con el motivo si no se pudo)
async function enviarPorCorreo(datos) {
  const ej = datosContacto().emailjs;

  if (!ej.serviceId || !ej.templateId || !ej.publicKey) {
    throw new Error("falta configurar EmailJS en js/datos-contacto.js (mira COMO-CONFIGURAR-EL-CORREO.txt)");
  }

  let respuesta;

  try {
    respuesta = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: ej.serviceId,
        template_id: ej.templateId,
        user_id: ej.publicKey,
        // Estos nombres son los que se usan dentro de la plantilla: {{from_name}}, {{message}}...
        template_params: {
          from_name: datos.nombre,
          from_email: datos.correo, // la plantilla lo usa en "Reply To" para poder responderle
          phone: datos.telefono || "(no indicó)",
          product: datos.producto,
          quantity: datos.cantidad,
          message: datos.mensaje,
          // Fecha y hora del mensaje (la plantilla la usa como {{time}})
          time: new Date().toLocaleString("es-CO"),
          // Mismos datos con otros nombres, por si la plantilla usa alguno de estos
          name: datos.nombre,
          user_name: datos.nombre,
          email: datos.correo,
          user_email: datos.correo,
          reply_to: datos.correo,
          telefono: datos.telefono || "(no indicó)",
          producto: datos.producto,
          cantidad: datos.cantidad,
          mensaje: datos.mensaje,
          title: datos.producto,
          subject: "Mensaje de " + datos.nombre + " desde el sitio web",
        },
      }),
    });
  } catch (error) {
    throw new Error("no hubo conexión con EmailJS (sin internet o bloqueado por el navegador)");
  }

  if (!respuesta.ok) {
    // EmailJS explica el problema en texto (clave incorrecta, plantilla no encontrada...)
    const motivo = await respuesta.text().catch(() => "");
    throw new Error(motivo || "EmailJS respondió con el código " + respuesta.status);
  }
}

// Arma el texto que se manda por WhatsApp
function textoParaWhatsApp(datos) {
  return (
    "Hola, soy " + datos.nombre + ". " +
    "Me interesa: " + datos.producto + " (cantidad: " + datos.cantidad + "). " +
    datos.mensaje + " " +
    "Mi correo: " + datos.correo + (datos.telefono ? " | Tel: " + datos.telefono : "")
  );
}

// Cuando falla el correo: muestra el motivo y una salida que siempre funciona
function agregarAyudaDeError(error, datos) {
  const caja = $("#fm");
  const enIngles = idioma === "en";

  // Motivo del fallo
  const detalle = document.createElement("small");
  detalle.style.display = "block";
  detalle.style.marginTop = ".4rem";
  detalle.textContent = (enIngles ? "Detail: " : "Detalle: ") + error.message;
  caja.appendChild(detalle);

  // Enlace que abre la app de correo de la persona con el mensaje ya escrito
  const enlace = document.createElement("a");
  enlace.href =
    "mailto:" + datosContacto().correo +
    "?subject=" + encodeURIComponent("Mensaje desde el sitio web de Aura floral") +
    "&body=" + encodeURIComponent(textoParaWhatsApp(datos));
  enlace.textContent = enIngles ? "Open my email app" : "Abrir mi app de correo";
  enlace.style.display = "inline-block";
  enlace.style.marginTop = ".4rem";
  enlace.style.fontWeight = "700";
  caja.appendChild(enlace);
}

// Llena la lista "Producto de interés" del formulario
function llenarListaDeProductos() {
  const lista = $("#prod");
  if (!lista) return;

  lista.innerHTML = PRODUCTOS
    .map((p) => `<option>${p.nombre} / ${p.nombreEn}</option>`)
    .join("");
}

// Pone en marcha los botones ENVIAR y WHATSAPP del formulario
function activarFormulario() {
  const formulario = $("#fc");
  const mensaje = $("#fm");
  const botonEnviar = $("#fc-enviar");
  const botonWhatsApp = $("#fc-whatsapp");
  if (!formulario || !mensaje) return;

  const decir = (es, en, esError) => {
    mensaje.className = "msg" + (esError ? " err" : "");
    mensaje.style.display = "block";
    mensaje.textContent = idioma === "en" ? en : es;
  };

  // Revisa los campos "required"; si falta algo avisa y devuelve false
  const formularioValido = () => {
    if (formulario.checkValidity()) return true;
    decir(
      "Completa tu nombre, un correo válido y tu mensaje.",
      "Please complete name, a valid email and your message.",
      true
    );
    return false;
  };

  // Botón ENVIAR: manda el mensaje al correo del negocio
  formulario.onsubmit = async (evento) => {
    evento.preventDefault(); // evita que la página se recargue
    if (!formularioValido()) return;

    const datos = datosDelFormulario(formulario);
    const textoOriginal = botonEnviar ? botonEnviar.textContent : "";

    if (botonEnviar) {
      botonEnviar.disabled = true;
      botonEnviar.textContent = idioma === "en" ? "Sending..." : "Enviando...";
    }

    try {
      await enviarPorCorreo(datos);
      decir(
        "¡Mensaje enviado! Te contactaremos pronto.",
        "Message sent! We will contact you soon.",
        false
      );
      formulario.reset();
    } catch (error) {
      decir(
        "No pudimos enviar el mensaje por correo. Inténtalo de nuevo o usa el botón de WhatsApp.",
        "We could not send the message by email. Please try again or use the WhatsApp button.",
        true
      );
      agregarAyudaDeError(error, datos);
    } finally {
      if (botonEnviar) {
        botonEnviar.disabled = false;
        botonEnviar.textContent = textoOriginal;
      }
    }
  };

  // Botón WHATSAPP: abre un chat con el mensaje ya escrito
  if (botonWhatsApp) {
    botonWhatsApp.onclick = () => {
      if (!formularioValido()) return;
      const datos = datosDelFormulario(formulario);
      window.open(enlaceWhatsApp() + "?text=" + encodeURIComponent(textoParaWhatsApp(datos)), "_blank", "noopener");
    };
  }
}

function paginaContacto() {
  // 1) Primero lo importante: opciones del producto y botones del formulario.
  llenarListaDeProductos();
  activarFormulario();

  // 2) Después las tarjetas de contacto. Si algo fallara aquí, el formulario
  //    ya quedó funcionando y el error se ve en la consola (F12).
  try {
    dibujarDatosContacto();
  } catch (error) {
    console.error("No se pudieron dibujar las tarjetas de contacto:", error);
  }
}
