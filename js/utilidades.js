/* =====================================================================
   utilidades.js - Herramientas pequeñas que usan todos los demás archivos
   ===================================================================== */

// Atajos para buscar elementos en la página
const $  = (selector, padre = document) => padre.querySelector(selector);
const $$ = (selector, padre = document) => [...padre.querySelectorAll(selector)];

// Convierte un número en precio: 65000 -> $65.000
const dinero = (numero) => "$" + numero.toLocaleString("es-CO");

/* ---------------------------------------------------------------------
   Almacen: guarda y lee datos en el navegador (carrito, idioma, sesión...)

   Cuando el sitio se abre como archivo (doble clic en el .html) cada
   navegador se comporta distinto: algunos bloquean localStorage, otros
   guardan los datos por separado para CADA página, y otros borran
   window.name. Por eso cada dato se guarda en VARIOS lugares a la vez,
   con la hora en que se guardó:

     1) localStorage        2) sessionStorage      3) window.name
     4) la dirección (?aura=...) que viaja al hacer clic en un enlace
     5) la memoria de la página actual

   Al leer, se usa SIEMPRE el más reciente. Así el carrito funciona igual
   en el computador de la profesora, sin importar el navegador.
   --------------------------------------------------------------------- */
const Almacen = {
  marca: "AURA:",
  parametro: "aura",
  viajan: ["carrito", "idioma", "usuario"], // lo que viaja en la dirección (nunca las contraseñas)
  memoria: {},

  // Cada dato se guarda con la hora: { __aura: 1, t: hora, v: valor }
  empaquetar(valor) {
    return { __aura: 1, t: Date.now(), v: valor };
  },

  // Entiende también los datos viejos (sin hora)
  desempaquetar(dato) {
    if (dato && typeof dato === "object" && dato.__aura === 1) return dato;
    return { t: 0, v: dato };
  },

  leerRespaldo() {
    try {
      if (window.name && window.name.indexOf(this.marca) === 0) {
        return JSON.parse(window.name.slice(this.marca.length)) || {};
      }
    } catch (error) {
      // respaldo dañado: se ignora
    }
    return {};
  },

  // Recoge el dato de todos los lugares y devuelve el más reciente (o null)
  leerDato(clave) {
    const candidatos = [];

    [() => window.localStorage, () => window.sessionStorage].forEach((lugar) => {
      try {
        const texto = lugar().getItem(clave);
        if (texto !== null && texto !== undefined) {
          candidatos.push(this.desempaquetar(JSON.parse(texto)));
        }
      } catch (error) {
        // bloqueado o dañado: se prueba el siguiente lugar
      }
    });

    const respaldo = this.leerRespaldo();
    if (Object.prototype.hasOwnProperty.call(respaldo, clave)) {
      candidatos.push(this.desempaquetar(respaldo[clave]));
    }

    if (Object.prototype.hasOwnProperty.call(this.memoria, clave)) {
      candidatos.push(this.memoria[clave]);
    }

    if (!candidatos.length) return null;
    return candidatos.reduce((a, b) => (b.t > a.t ? b : a));
  },

  leer(clave, valorPorDefecto) {
    const dato = this.leerDato(clave);
    return dato ? dato.v : valorPorDefecto;
  },

  // Escribe un dato (con su hora) en todos los lugares posibles
  escribir(clave, dato) {
    this.memoria[clave] = dato;

    try { window.localStorage.setItem(clave, JSON.stringify(dato)); } catch (error) { /* bloqueado */ }
    try { window.sessionStorage.setItem(clave, JSON.stringify(dato)); } catch (error) { /* bloqueado */ }

    try {
      const respaldo = this.leerRespaldo();
      respaldo[clave] = dato;
      window.name = this.marca + JSON.stringify(respaldo);
    } catch (error) {
      // el sitio sigue funcionando sin este respaldo
    }
  },

  guardar(clave, valor) {
    this.escribir(clave, this.empaquetar(valor));
  },

  // Texto con el carrito, el idioma y la sesión (con su hora) para llevarlo en la dirección
  paquete() {
    const lista = {};
    this.viajan.forEach((clave) => {
      const dato = this.leerDato(clave);
      if (dato) lista[clave] = dato;
    });
    return JSON.stringify(lista);
  },

  // Devuelve la dirección con el paquete agregado (para ir a otra página)
  conEstado(direccion) {
    try {
      const url = new URL(direccion, location.href);
      url.searchParams.set(this.parametro, this.paquete());
      return url.href;
    } catch (error) {
      return direccion;
    }
  },

  // Al abrir una página: si llegó un paquete en la dirección, se recibe y se limpia la dirección.
  // Cada dato solo se acepta si es más reciente que el que ya hay.
  recibirDeLaDireccion() {
    try {
      const url = new URL(location.href);
      const texto = url.searchParams.get(this.parametro);
      if (!texto) return;

      const lista = JSON.parse(texto);
      Object.keys(lista).forEach((clave) => {
        if (this.viajan.indexOf(clave) === -1) return;
        const recibido = this.desempaquetar(lista[clave]);
        const actual = this.leerDato(clave);
        if (!actual || recibido.t > actual.t) this.escribir(clave, recibido);
      });
    } catch (error) {
      // paquete dañado: se ignora
    }

    try {
      const url = new URL(location.href);
      url.searchParams.delete(this.parametro);
      history.replaceState(null, "", url.pathname + url.search + url.hash);
    } catch (error) {
      // si no se puede limpiar la dirección, no pasa nada
    }
  },

  // Cada clic en un enlace del sitio lleva el paquete en la dirección
  activarViaje() {
    document.addEventListener("click", (evento) => {
      const enlace = evento.target.closest && evento.target.closest("a[href]");
      if (!enlace || enlace.target === "_blank" || enlace.hasAttribute("download")) return;

      const destino = enlace.getAttribute("href");
      if (!destino || destino.charAt(0) === "#" || /^(mailto:|tel:|javascript:)/i.test(destino)) return;
      if (/^https?:\/\//i.test(destino) && location.protocol !== "file:" && enlace.origin !== location.origin) return;
      if (/^https?:\/\//i.test(destino) && location.protocol === "file:") return;

      enlace.href = this.conEstado(destino);
    }, true);
  },
};

Almacen.recibirDeLaDireccion();
Almacen.activarViaje();

// Convierte un formulario en un objeto { nombreDelCampo: valor }
// (funciona también en navegadores antiguos)
function datosDelFormulario(formulario) {
  const datos = {};
  $$("input, select, textarea", formulario).forEach((campo) => {
    if (campo.name) datos[campo.name] = campo.value;
  });
  return datos;
}

/* ---------------------------------------------------------------------
   Datos de contacto con RESPALDO

   Normalmente salen de js/datos-contacto.js. Si ese archivo no se pudiera
   cargar (por ejemplo, tiene otro nombre como "datos-contacto (1).js"), el
   sitio usa esta copia para que el pie de página, las tarjetas de Contacto
   y el formulario sigan funcionando.
   Si cambias un dato en datos-contacto.js, cámbialo también aquí.
   --------------------------------------------------------------------- */
const DATOS_DE_RESPALDO = {
  telefono: "3152843262",
  indicativo: "57",
  telefonoVisible: "+57 315 284 3262",
  correo: "aurafloralaetesania@gmail.com",
  instagram: {
    usuario: "@aura.floral_gift",
    url: "https://www.instagram.com/aura.floral_gift?vrfl=NnhlcnJsdmhqMGZn",
  },
  tiktok: {
    usuario: "@aura.floralgitf",
    url: "https://www.tiktok.com/@aura.floralgitf?_r=1&_t=ZS-9AuntmndiLf",
  },
  ubicacion: "I.E. Villacolombia",
  emailjs: {
    serviceId: "service_go1rq3w",
    templateId: "template_gkkqdvs",
    templateIdCompra: "template_cyek377",
    publicKey: "DOxDjIoQRJnlcMKP_",
  },
};

function datosContacto() {
  if (typeof DATOS_CONTACTO !== "undefined") return DATOS_CONTACTO;

  console.warn("No se cargó js/datos-contacto.js: revisa que se llame exactamente así y esté dentro de la carpeta js/. Se usan los datos de respaldo.");
  return DATOS_DE_RESPALDO;
}

// Enlace que abre un chat de WhatsApp con el número del negocio
const enlaceWhatsApp = () => "https://wa.me/" + datosContacto().indicativo + datosContacto().telefono;
