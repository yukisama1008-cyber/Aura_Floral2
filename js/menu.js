/* =====================================================================
   menu.js - Encabezado y menú de navegación (con submenús desplegables)

   Se escribe una sola vez aquí y aparece en todas las páginas.

   PARA CAMBIAR EL MENÚ edita la lista MENU:
   - archivo : nombre de la página (sin .html)
   - ancla   : (opcional) parte de la página a la que baja, ej. "equipo"
   - es / en : texto en español e inglés
   - sub     : (opcional) lista de opciones del submenú desplegable
   ===================================================================== */

const MENU = [
  { archivo: "inicio", es: "Inicio", en: "Home" },

  { archivo: "productos", es: "Tienda", en: "Shop", sub: [
    { archivo: "productos", es: "Productos", en: "Products" },
    { archivo: "catalogo",  es: "Catálogo",  en: "Catalog" },
  ] },

  { archivo: "nosotros", es: "Nosotros", en: "About Us", sub: [
    { archivo: "nosotros", es: "Quiénes somos",  en: "Who we are" },
    { archivo: "nosotros", ancla: "equipo", es: "Equipo", en: "Team" },
    { archivo: "mision",   es: "Misión",         en: "Mission" },
    { archivo: "vision",   es: "Visión",         en: "Vision" },
    { archivo: "proceso",  es: "Proceso y video", en: "Process" },
  ] },

  { archivo: "contacto", es: "Contacto", en: "Contact Us" },
];

// Dirección de una opción: "nosotros.html" o "nosotros.html#equipo"
const enlaceDe = (item) => item.archivo + ".html" + (item.ancla ? "#" + item.ancla : "");

function crearEncabezado() {
  const paginaActual = document.body.dataset.page;
  const usuario = Almacen.leer("usuario");

  // Una pestaña por cada elemento de MENU
  const pestanas = MENU.map((item, i) => {
    const subActivo = (item.sub || []).some((s) => s.archivo === paginaActual && !s.ancla);
    const activa = item.archivo === paginaActual || subActivo ? "on" : "";

    // Pestaña CON submenú desplegable
    if (item.sub) {
      const opciones = item.sub.map((s, j) => `
            <li style="--i:${j}">
              <a href="${enlaceDe(s)}" class="${s.archivo === paginaActual && !s.ancla ? "on" : ""}"
                 data-en="${s.en}">${s.es}</a>
            </li>`).join("");

      return `
        <li class="tiene-sub" style="--i:${i}">
          <a class="tab ${activa}" href="${enlaceDe(item)}" aria-haspopup="true" aria-expanded="false">
            <span data-en="${item.en}">${item.es}</span><i class="flecha" aria-hidden="true">▾</i>
          </a>
          <ul class="sub">${opciones}
          </ul>
        </li>`;
    }

    // Pestaña simple
    return `
        <li style="--i:${i}">
          <a class="tab ${activa}" href="${enlaceDe(item)}" data-en="${item.en}">${item.es}</a>
        </li>`;
  }).join("");

  // Si hay sesión iniciada se muestra el nombre, si no, "Iniciar sesión"
  const botonSesion = usuario
    ? "👤 " + usuario.nombre
    : '<span data-en="Log in">Iniciar sesión</span>';

  // Banner + encabezado (arriba del <body>)
  document.body.insertAdjacentHTML("afterbegin", `
    <div class="banner"
         data-en="˚⊱🪷⊰˚ gifts that last forever ๋࣭ ⭑⚝">
      ˚⊱🪷⊰˚ Regalos artesanales que duran para siempre ๋࣭ ⭑⚝
    </div>

    <header class="top">
      <a class="logo-link" href="inicio.html">
        <img class="logo" src="../imagenes/logo-aura-floral.jpg" alt="Aura floral artesanía">
      </a>

      <button class="menu-toggle" aria-label="Menú" aria-expanded="false" aria-controls="menu-principal">☰</button>

      <nav class="menu" id="menu-principal" aria-label="Menú principal">
        <ul>${pestanas}
        </ul>
      </nav>

      <div class="acc">
        <button id="btn-idioma" aria-label="Idioma / Language">EN</button>
        <a href="login.html">${botonSesion}</a>
        <a class="cart" href="carrito.html" aria-label="Shopping Cart">🛒<b>0</b></a>
      </div>
    </header>`);
}

/* ---------------------------------------------------------------------
   Comportamiento del menú: abrir/cerrar en celular y accesibilidad
   --------------------------------------------------------------------- */
function activarMenu() {
  const boton = $(".menu-toggle");
  const menu = $("#menu-principal");
  const esCelular = () => window.matchMedia("(max-width: 960px)").matches;

  function cerrarSubmenus() {
    $$(".tiene-sub").forEach((li) => {
      li.classList.remove("abierto");
      $(".tab", li).setAttribute("aria-expanded", "false");
    });
  }

  function cerrarTodo() {
    cerrarSubmenus();
    menu.classList.remove("abierto");
    boton.setAttribute("aria-expanded", "false");
    boton.textContent = "☰";
  }

  // Botón hamburguesa (solo visible en celular)
  boton.onclick = () => {
    const abierto = menu.classList.toggle("abierto");
    boton.setAttribute("aria-expanded", abierto);
    boton.textContent = abierto ? "✕" : "☰";
  };

  $$(".tiene-sub").forEach((li) => {
    const pestana = $(".tab", li);

    // En celular, tocar "Tienda" o "Nosotros" despliega su submenú (no cambia de página)
    pestana.addEventListener("click", (evento) => {
      if (!esCelular()) return;
      evento.preventDefault();
      const abrir = !li.classList.contains("abierto");
      cerrarSubmenus();
      li.classList.toggle("abierto", abrir);
      pestana.setAttribute("aria-expanded", abrir);
    });

    // En computador, mantiene aria-expanded al día para lectores de pantalla
    li.addEventListener("mouseenter", () => !esCelular() && pestana.setAttribute("aria-expanded", "true"));
    li.addEventListener("mouseleave", () => !esCelular() && pestana.setAttribute("aria-expanded", "false"));
    li.addEventListener("focusin", () => pestana.setAttribute("aria-expanded", "true"));
    li.addEventListener("focusout", () => pestana.setAttribute("aria-expanded", "false"));
  });

  // Tecla Escape o clic fuera del encabezado: cierra todo
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      cerrarTodo();
      if (document.activeElement) document.activeElement.blur();
    }
  });

  document.addEventListener("click", (evento) => {
    if (!evento.target.closest(".top")) cerrarTodo();
  });
}
