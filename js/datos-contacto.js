/* =====================================================================
   datos-contacto.js - Datos de contacto de Aura floral artesanía

   Es el ÚNICO lugar donde están el teléfono, el correo y las redes.
   Si algo cambia, edítalo aquí y se actualiza en el pie de página de
   todas las páginas y en la página de Contacto.
   ===================================================================== */

const DATOS_CONTACTO = {
  // Teléfono / WhatsApp (el 57 es el indicativo de Colombia)
  telefono: "3152843262",
  indicativo: "57",
  telefonoVisible: "+57 315 284 3262",

  // Correo electrónico
  correo: "aurafloralaetesania@gmail.com",

  // Redes sociales
  instagram: {
    usuario: "@aura.floral_artesania",
    url: "https://www.instagram.com/aura.floral_artesania?xtok=MW5teTlpNHQzbzU0MA==",
  },
  tiktok: {
    usuario: "@aura.floralgitf",
    url: "https://www.tiktok.com/@aura.floralgitf?_r=1&_t=ZS-9AuntmndiLf",
  },

  ubicacion: "I.E. Villacolombia",

  // Envío de los mensajes del formulario al correo, con el servicio gratuito EmailJS.
  // Pega aquí tus 3 datos (pasos en COMO-CONFIGURAR-EL-CORREO.txt).
  // Mientras estén vacíos, el formulario NO puede enviar al correo.
  emailjs: {
    serviceId: "service_go1rq3w",    // empieza por service_
    templateId: "template_gkkqdvs",   // plantilla del formulario de Contacto (correo para la empresa)
    templateIdCompra: "template_cyek377", // plantilla de la compra (correo para el cliente)
    publicKey: "DOxDjIoQRJnlcMKP_",    // clave pública (Account > General)
  },
};

// Enlace que abre un chat de WhatsApp con el número del negocio
const urlWhatsApp = () => "https://wa.me/" + DATOS_CONTACTO.indicativo + DATOS_CONTACTO.telefono;
