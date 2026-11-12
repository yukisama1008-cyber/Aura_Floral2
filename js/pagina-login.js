/* pagina-login.js - Login: iniciar sesión o crear cuenta (se guarda en el navegador) */

function paginaLogin() {
  const formulario = $("#fl");
  const mensaje = $("#lm");
  const botonCambiar = $("#sw");
  let creandoCuenta = false;

  // Muestra u oculta el campo "nombre" y cambia los textos
  function actualizarFormulario() {
    $$(".solo-reg").forEach((e) => (e.style.display = creandoCuenta ? "" : "none"));
    $("#nom").required = creandoCuenta;

    $("#lt").textContent = creandoCuenta
      ? (idioma === "en" ? "Create account" : "Crear cuenta")
      : (idioma === "en" ? "Log in" : "Iniciar sesión");

    botonCambiar.textContent = creandoCuenta
      ? (idioma === "en" ? "I already have an account" : "Ya tengo cuenta")
      : (idioma === "en" ? "Create a new account" : "Crear una cuenta nueva");
  }

  function mostrarError(es, en) {
    mensaje.style.display = "block";
    mensaje.className = "msg err";
    mensaje.textContent = idioma === "en" ? en : es;
  }

  actualizarFormulario();

  botonCambiar.onclick = () => {
    creandoCuenta = !creandoCuenta;
    actualizarFormulario();
  };

  formulario.onsubmit = (evento) => {
    evento.preventDefault();

    const datos = datosDelFormulario(formulario);
    const usuarios = Almacen.leer("usuarios", {});

    if (creandoCuenta) {
      if (usuarios[datos.correo]) {
        mostrarError("Ese correo ya está registrado.", "That email is already registered.");
        return;
      }
      usuarios[datos.correo] = { nombre: datos.nombre, clave: datos.clave };
      Almacen.guardar("usuarios", usuarios);
    } else if (!usuarios[datos.correo] || usuarios[datos.correo].clave !== datos.clave) {
      mostrarError("Correo o contraseña incorrectos.", "Wrong email or password.");
      return;
    }

    // Sesión iniciada: guarda el usuario y vuelve al inicio
    Almacen.guardar("usuario", { nombre: usuarios[datos.correo].nombre, correo: datos.correo });
    location.href = Almacen.conEstado("inicio.html");
  };
}
