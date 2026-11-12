/* =====================================================================
   carrito.js - Carrito de compras

   El carrito es un objeto: { idProducto: cantidad }
   Ejemplo: { 1: 2, 6: 1 } = 2 unidades del producto 1 y 1 del producto 6
   ===================================================================== */

const leerCarrito = () => Almacen.leer("carrito", {});

const totalUnidades = () =>
  Object.values(leerCarrito()).reduce((suma, cantidad) => suma + cantidad, 0);

// Actualiza el numerito del icono del carrito (y lo hace "rebotar" si se pide)
function actualizarContador(animar = false) {
  const contador = $(".cart b");
  contador.textContent = totalUnidades();

  if (animar) {
    contador.classList.remove("bump");
    void contador.offsetWidth; // reinicia la animación
    contador.classList.add("bump");
  }
}

function agregarAlCarrito(id) {
  const carrito = leerCarrito();
  carrito[id] = (carrito[id] || 0) + 1;
  Almacen.guardar("carrito", carrito);
  actualizarContador(true);

  const producto = PRODUCTOS.find((p) => p.id == id);
  mostrarAviso(
    idioma === "en"
      ? "Added to cart: " + producto.nombreEn
      : "Agregado al carrito: " + producto.nombre
  );
}

// Un solo "oyente" atiende todos los botones de la página
document.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button");
  if (!boton) return;

  const datos = boton.dataset;
  const carrito = leerCarrito();

  // Botón "Agregar al carrito"
  if (datos.add) {
    agregarAlCarrito(datos.add);
    boton.classList.remove("agregado");
    void boton.offsetWidth;
    boton.classList.add("agregado");
  }

  // Botones + , − y Eliminar (solo existen en carrito.html)
  if (datos.mas || datos.menos || datos.borrar) {
    if (datos.mas) carrito[datos.mas]++;

    if (datos.menos) {
      carrito[datos.menos]--;
      if (carrito[datos.menos] < 1) delete carrito[datos.menos];
    }

    if (datos.borrar) delete carrito[datos.borrar];

    Almacen.guardar("carrito", carrito);
    dibujarCarrito();
  }

  // Botón "Comprar ahora": envía el correo de confirmación al cliente,
  // vacía el carrito y va a la página de gracias
  if (boton.id === "buy") {
    finalizarCompra(boton);
  }
});

/* ---------------------------------------------------------------------
   Correo de confirmación de compra (EmailJS, plantilla templateIdCompra)
   Variables que recibe la plantilla: to_email, to_name, order_id,
   orders (lista con name, units, price), order_summary, cost.total ...
   --------------------------------------------------------------------- */
function pedirCorreoDelCliente() {
  // Lee el correo escrito en la barra del carrito
  const campo = $("#correo-compra");
  const aviso = $("#correo-compra-msg");
  const correo = campo ? campo.value.trim() : "";

  if (!/^\S+@\S+\.\S+$/.test(correo)) {
    if (aviso) {
      aviso.className = "msg err";
      aviso.style.display = "block";
      aviso.textContent = idioma === "en"
        ? "Please enter a valid email to receive your confirmation."
        : "Escribe un correo válido para enviarte la confirmación.";
    }
    if (campo) campo.focus();
    return null;
  }

  const usuario = Almacen.leer("usuario", null);
  return { nombre: (usuario && usuario.nombre) || "", correo };
}

async function enviarCorreoDeCompra(cliente, carrito) {
  const ej = datosContacto().emailjs;
  if (!ej.serviceId || !ej.templateIdCompra || !ej.publicKey) {
    throw new Error("falta configurar EmailJS en js/datos-contacto.js");
  }

  let total = 0;
  const pedidos = Object.keys(carrito).map((id) => {
    const producto = PRODUCTOS.find((p) => p.id == id);
    const subtotal = producto.precio * carrito[id];
    total += subtotal;
    return {
      name: producto.nombre,
      units: carrito[id],
      price: producto.precio.toLocaleString("es-CO"),
      subtotal: subtotal.toLocaleString("es-CO"),
    };
  });

  const nombres = pedidos.map((p) => p.name + " (x" + p.units + ")").join(", ");
  const unidades = pedidos.reduce((suma, p) => suma + p.units, 0);

  const fecha = new Date().toLocaleDateString("es-CO");

  // Filas de la tabla en HTML (Producto | Cant. | Precio | Subtotal)
  const celda = 'style="padding:8px 10px;border-bottom:1px solid #f3d6dd"';
  const filasHtml = pedidos
    .map((p) =>
      "<tr><td " + celda + ">" + p.name + "</td>" +
      "<td " + celda + ' align="center">' + p.units + "</td>" +
      "<td " + celda + ' align="right">$' + p.price + "</td>" +
      "<td " + celda + ' align="right">$' + p.subtotal + "</td></tr>")
    .join("");

  const resumen = pedidos
    .map((p) => p.name + " x" + p.units + " - $" + p.subtotal)
    .join("\n");

  const respuesta = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: ej.serviceId,
      template_id: ej.templateIdCompra,
      user_id: ej.publicKey,
      template_params: {
        // Destinatario (en la plantilla, el campo "To Email" debe ser {{to_email}})
        to_email: cliente.correo,
        email: cliente.correo,
        user_email: cliente.correo,
        customer_email: cliente.correo,
        reply_to: datosContacto().correo,
        to_name: cliente.nombre || cliente.correo,
        name: cliente.nombre || cliente.correo,
        user_name: cliente.nombre || cliente.correo,
        order_id: "AF-" + Date.now().toString().slice(-8),

        // Fecha del pedido
        date: fecha,
        order_date: fecha,
        fecha: fecha,

        // Tabla ya armada en HTML (en la plantilla se usa con triple llave: {{{items_html}}})
        items_html: filasHtml,
        order_rows: filasHtml,
        rows: filasHtml,

        // Productos y precios (lista y también texto plano)
        items: pedidos,
        orders: pedidos,
        order_total: "$" + total.toLocaleString("es-CO"),
        total_price: "$" + total.toLocaleString("es-CO"),
        cart_total: "$" + total.toLocaleString("es-CO"),
        subtotal: "$" + total.toLocaleString("es-CO"),
        order_summary: resumen,
        product: nombres,
        product_name: nombres,
        products: nombres,
        quantity: unidades,
        units: unidades,
        price: "$" + total.toLocaleString("es-CO"),
        total: "$" + total.toLocaleString("es-CO"),
        cost: { total: total.toLocaleString("es-CO") },

        // Datos de contacto de Aura floral (los que usa la plantilla: business_*)
        business_phone: datosContacto().telefonoVisible,
        business_email: datosContacto().correo,
        business_instagram: datosContacto().instagram.usuario,
        business_tiktok: datosContacto().tiktok.usuario,
        business_location: datosContacto().ubicacion,
        business_name: "Aura floral artesanía",

        contact_phone: datosContacto().telefonoVisible,
        phone: datosContacto().telefonoVisible,
        contact_email: datosContacto().correo,
        contact_instagram: datosContacto().instagram.usuario,
        contact_tiktok: datosContacto().tiktok.usuario,
        contact_location: datosContacto().ubicacion,
        contact_whatsapp: enlaceWhatsApp(),
      },
    }),
  });

  if (!respuesta.ok) {
    const motivo = await respuesta.text().catch(() => "");
    throw new Error(motivo || "EmailJS respondió con el código " + respuesta.status);
  }
}

async function finalizarCompra(boton) {
  if (boton.dataset.comprando) return; // evita doble clic
  const carrito = leerCarrito();
  if (!Object.keys(carrito).length) return;

  // Sin un correo válido en la barra del carrito no se completa la compra
  const cliente = pedirCorreoDelCliente();
  if (!cliente) return;

  boton.dataset.comprando = "1";
  boton.disabled = true;

  // Si el correo falla, la compra igual se completa (solo queda el error en la consola)
  try {
    await enviarCorreoDeCompra(cliente, carrito);
  } catch (error) {
    console.error("No se pudo enviar el correo de la compra:", error);
  }

  Almacen.guardar("carrito", {});
  location.href = "gracias.html";
}
