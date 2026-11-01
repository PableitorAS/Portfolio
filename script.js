// ===== Modo oscuro =====

// 1. Buscamos en la página los elementos con los que vamos a trabajar
const boton = document.getElementById("boton-tema");
const cuerpo = document.body;

// 2. Función que pone el texto correcto en el botón
function actualizarBoton() {
  if (cuerpo.classList.contains("oscuro")) {
    boton.textContent = "☀️ Modo claro";
  } else {
    boton.textContent = "🌙 Modo oscuro";
  }
}

// 3. Al cargar la página: si la última vez eligió oscuro, lo aplicamos
if (localStorage.getItem("tema") === "oscuro") {
  cuerpo.classList.add("oscuro");
}
actualizarBoton();

// 4. Cuando se pulse el botón: cambiamos de tema y lo guardamos
boton.addEventListener("click", function () {
  cuerpo.classList.toggle("oscuro");

  if (cuerpo.classList.contains("oscuro")) {
    localStorage.setItem("tema", "oscuro");
  } else {
    localStorage.setItem("tema", "claro");
  }

  actualizarBoton();
});
