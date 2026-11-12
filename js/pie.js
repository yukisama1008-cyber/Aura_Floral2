/* =====================================================================
   pie.js - Pie de página (aparece igual en todas las páginas)

   Los datos de contacto salen de js/datos-contacto.js
   ===================================================================== */

function crearPie() {
  const d = datosContacto();

  // Enlaces del pie: todas las páginas del menú (sin repetir)
  const enlaces = [];
  MENU.forEach((item) => {
    (item.sub || [item]).forEach((opcion) => {
      if (!opcion.ancla) enlaces.push(opcion);
    });
  });

  const menuPie = enlaces.map((item) => `
      <a href="${enlaceDe(item)}" data-en="${item.en}">${item.es}</a>`).join("");

  document.body.insertAdjacentHTML("beforeend", `
    <footer class="pie">
      <nav>${menuPie}
      </nav>
      <p>
        <a href="${d.instagram.url}" target="_blank" rel="noopener">Instagram</a> ·
        <a href="${d.tiktok.url}" target="_blank" rel="noopener">TikTok</a> ·
        <a href="${enlaceWhatsApp()}" target="_blank" rel="noopener">WhatsApp</a>
      </p>
      <p>
        <a href="mailto:${d.correo}">${d.correo}</a> · ${d.telefonoVisible}
      </p>
      <p data-en="“Unique handmade details designed to bloom in your life forever”">
        <em>“Detalles únicos y artesanales diseñados para florecer en tu vida para siempre”</em>
      </p>
      <p><small>© 2026 Aura floral artesanía · ${d.ubicacion} · 11-3</small></p>
    </footer>`);
}
