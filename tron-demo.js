// ===== Demo de la práctica de IA: el agente busca la meta en un laberinto =====
// Es una versión en JavaScript de mi práctica 2 (hecha en Java).
// Mismo mapa y mismos costes: bajar (S) o derecha (E) cuestan 1; subir (N) o izquierda (O) cuestan 2.

const MAPA = [
  "####################",
  "#A                 #",
  "# # # ###### ##### #",
  "#                 ##",
  "# ##### ###### ### #",
  "# # # #             ",
  "# ### ######## # # #",
  "# # #           #   ",
  "# ############## S #",
  "####################",
];

const FILAS = MAPA.length;
const COLS = MAPA[0].length;

// Buscamos dónde empieza el agente (A) y dónde está la meta (S)
let inicio, meta;
for (let f = 0; f < FILAS; f++) {
  for (let c = 0; c < COLS; c++) {
    if (MAPA[f][c] === "A") inicio = { f: f, c: c };
    if (MAPA[f][c] === "S") meta = { f: f, c: c };
  }
}

// Igual que esTransitable() en Java: dentro del mapa y sin muro
function esTransitable(f, c) {
  return f >= 0 && f < FILAS && c >= 0 && c < COLS && MAPA[f][c] !== "#";
}

// Movimientos en el mismo orden que en la práctica: S, N, O, E
const MOVIMIENTOS = [
  { df: 1, dc: 0, coste: 1 },  // S
  { df: -1, dc: 0, coste: 2 }, // N
  { df: 0, dc: -1, coste: 2 }, // O
  { df: 0, dc: 1, coste: 1 },  // E
];

// Heurística de A*: distancia Manhattan hasta la meta
function h(f, c) {
  return Math.abs(f - meta.f) + Math.abs(c - meta.c);
}

// Búsqueda genérica: con A* ordenamos "abiertos" por f = g + h; con BFS es una cola normal
function buscar(algoritmo) {
  const abiertos = [{ f: inicio.f, c: inicio.c, g: 0, padre: null }];
  const cerrados = new Set();
  const explorados = []; // casillas en el orden en que se cierran (para animarlas)

  while (abiertos.length > 0) {
    if (algoritmo === "aestrella") {
      abiertos.sort(function (a, b) { return (a.g + h(a.f, a.c)) - (b.g + h(b.f, b.c)); });
    }
    const nodo = abiertos.shift(); // sacamos el primero

    const clave = nodo.f + "," + nodo.c;
    if (cerrados.has(clave)) continue;
    cerrados.add(clave);
    explorados.push(nodo);

    if (nodo.f === meta.f && nodo.c === meta.c) {
      // Reconstruimos el camino yendo de padre en padre
      const camino = [];
      let actual = nodo;
      while (actual) {
        camino.unshift(actual);
        actual = actual.padre;
      }
      return { explorados: explorados, camino: camino, coste: nodo.g };
    }

    for (const m of MOVIMIENTOS) {
      const nf = nodo.f + m.df;
      const nc = nodo.c + m.dc;
      if (esTransitable(nf, nc) && !cerrados.has(nf + "," + nc)) {
        abiertos.push({ f: nf, c: nc, g: nodo.g + m.coste, padre: nodo });
      }
    }
  }
  return null;
}

// ===== Dibujo y animación =====
const ventana = document.getElementById("demo-tron");
const tablero = document.getElementById("tablero");
const info = document.getElementById("demo-info");
let temporizador = null;
let casillas = [];

// Creamos un <div> por casilla dentro del tablero
function dibujarMapa() {
  tablero.innerHTML = "";
  tablero.style.gridTemplateColumns = "repeat(" + COLS + ", 1fr)";
  casillas = [];
  for (let f = 0; f < FILAS; f++) {
    casillas.push([]);
    for (let c = 0; c < COLS; c++) {
      const div = document.createElement("div");
      div.className = "casilla";
      if (MAPA[f][c] === "#") div.classList.add("muro");
      if (MAPA[f][c] === "S") div.classList.add("meta");
      tablero.appendChild(div);
      casillas[f].push(div);
    }
  }
  casillas[inicio.f][inicio.c].classList.add("agente");
}

function lanzar(algoritmo) {
  clearInterval(temporizador);
  dibujarMapa();
  const resultado = buscar(algoritmo);
  const nombre = algoritmo === "aestrella" ? "A*" : "BFS";
  let paso = 0;

  // Fase 1: pintamos las casillas que va explorando el algoritmo
  temporizador = setInterval(function () {
    if (paso < resultado.explorados.length) {
      const n = resultado.explorados[paso];
      casillas[n.f][n.c].classList.add("explorada");
      info.textContent = nombre + ": explorando… " + (paso + 1) + " casillas";
      paso++;
      return;
    }
    // Fase 2: el agente recorre el camino encontrado
    const i = paso - resultado.explorados.length;
    if (i < resultado.camino.length) {
      const n = resultado.camino[i];
      casillas[n.f][n.c].classList.add("camino");
      paso++;
      return;
    }
    clearInterval(temporizador);
    info.textContent = nombre + ": " + resultado.explorados.length + " casillas exploradas · camino de " +
      (resultado.camino.length - 1) + " pasos · coste " + resultado.coste;
  }, 35);
}

// Botones
document.getElementById("abrir-demo").addEventListener("click", function () {
  ventana.showModal(); // abre el <dialog> como ventana emergente
  lanzar("aestrella");
});
document.getElementById("demo-bfs").addEventListener("click", function () { lanzar("bfs"); });
document.getElementById("demo-aestrella").addEventListener("click", function () { lanzar("aestrella"); });
document.getElementById("cerrar-demo").addEventListener("click", function () {
  clearInterval(temporizador);
  ventana.close();
});
