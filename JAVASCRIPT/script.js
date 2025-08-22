const provincias = document.querySelectorAll("svg path");
const puntaje1Span = document.getElementById("puntaje1");
const puntaje2Span = document.getElementById("puntaje2");

const turnoDisplay = document.getElementById("turno");
const contPregunta = document.getElementById("pregunta-container");
const preguntaTxt = document.getElementById("pregunta");

const mensajeGanador = document.getElementById("mensaje-ganador");

const divGanador = document.getElementById("ganador");
const opcionesDiv = document.getElementById("opciones");

let turno               = 1; // 1 = Jugador 1 | 2 = Jugador 2
let provinciaActual     = null;
let preguntaActual      = null;
const puntajes          = { 1: 0, 2: 0 };

let preguntaAbierta = false;

/* SONIDO DE LA EXPLOSION */
/* ---------------------------------------------------------------------------------------- */
const EXPLOSION_SRC = "../musicas/explosionconquista.mp3";
const explosionBase = new Audio(EXPLOSION_SRC);
explosionBase.volume = 1.0; 

function playExplosion() {
  const sfx = explosionBase.cloneNode(true);
  sfx.volume = explosionBase.volume;
  sfx.play().catch(() => {

  });
  setTimeout(() => sfx.remove(), 4000);
}



/* PREGUNTAS */
/*--------------------------------------------------------------------------------*/
const preguntas = [
  { texto: "¿Cuándo fue la independencia de Guayaquil?",
    opciones: ["1820", "1830", "1810", "1809"],
    correcta: "1820" },

  { texto: "¿Quién fue el primer presidente del Ecuador?",
    opciones: ["Vicente Rocafuerte", "Juan José Flores",
               "Eloy Alfaro", "Gabriel García Moreno"],
    correcta: "Juan José Flores" },

  { texto: "¿Qué ciudad se conoce como 'Luz de América'?",
    opciones: ["Quito", "Guayaquil", "Cuenca", "Loja"],
    correcta: "Quito" },

  { texto: "¿En qué año se creó la República del Ecuador?",
    opciones: ["1830", "1822", "1809", "1850"],
    correcta: "1830" },

  { texto: "¿Qué prócer lideró la independencia de Guayaquil?",
    opciones: ["Simón Bolívar", "Vicente Rocafuerte",
               "José Joaquín de Olmedo", "Antonio José de Sucre"],
    correcta: "José Joaquín de Olmedo" },

  { texto: "¿Qué presidente promovió la Revolución Liberal?",
    opciones: ["Eloy Alfaro", "Juan José Flores",
               "Velasco Ibarra", "Galo Plaza"],
    correcta: "Eloy Alfaro" },

  { texto: "¿Qué batalla selló la independencia del Ecuador?",
    opciones: ["Batalla de Pichincha", "Batalla de Ayacucho",
               "Batalla de Junín", "Batalla de Boyacá"],
    correcta: "Batalla de Pichincha" }
];
/*--------------------------------------------------------------------------------*/


/* EVENTOS SOBRE PROVINCIAS */
/*--------------------------------------------------------------------------------*/

provincias.forEach(p => {
  p.addEventListener("click", () => {
    if (preguntaAbierta) return; // evitar abrir varias preguntas
    if (p.classList.contains("conquistado-1") || p.classList.contains("conquistado-2")) return;

    provinciaActual = p;
    mostrarPregunta();
    preguntaAbierta = true;
  });
});
/*--------------------------------------------------------------------------------*/



/* LOGICA DE PREGUNTAS */
/*--------------------------------------------------------------------------------*/
function mostrarPregunta() {
  preguntaActual = preguntas[Math.floor(Math.random() * preguntas.length)];
  preguntaTxt.textContent = preguntaActual.texto;
  opcionesDiv.innerHTML = "";

  preguntaActual.opciones.forEach(op => {
    const btn = document.createElement("button");
    btn.textContent = op;
    btn.onclick = () => verificarRespuesta(op);
    opcionesDiv.appendChild(btn);
  });

  contPregunta.classList.remove("oculto");
}

function verificarRespuesta(seleccionada) {
  if (seleccionada === preguntaActual.correcta) {
    provinciaActual.classList.add(`conquistado-${turno}`);
    alert("✅ ¡Correcto! Provincia conquistada.");
    puntajes[turno] += 1;
    actualizarPuntajes();

    if (verificarFinJuego()) return;

    // Mantiene el turno (no cambia)
  } else {
    alert(`❌ Incorrecto. La respuesta correcta era: ${preguntaActual.correcta}.`);
    // Cambia de turno solo si falló
    turno = turno === 1 ? 2 : 1;
  }

  turnoDisplay.textContent = `Jugador ${turno}`;
  contPregunta.classList.add("oculto");
  preguntaAbierta = false;
}
/*--------------------------------------------------------------------------------*/



/* PUNTAJE Y GANADOR */ 
/*--------------------------------------------------------------------------------*/  
function actualizarPuntajes() {
  puntaje1Span.textContent = puntajes[1];
  puntaje2Span.textContent = puntajes[2];
}

function verificarFinJuego() {
  const totalProvincias = provincias.length;
  const conquistadas    = document.querySelectorAll(".conquistado-1, .conquistado-2").length;

  if (conquistadas === totalProvincias) {
    mostrarGanador();
    return true;
  }
  return false;
}


function mostrarGanador() {
  divGanador.classList.remove("oculto");

  // Bloquear más clicks
  provincias.forEach(p => p.style.pointerEvents = "none");

  if (puntajes[1] > puntajes[2]) {
    mensajeGanador.textContent = "🎉 ¡Jugador 1 ha ganado la partida!";
  } else if (puntajes[2] > puntajes[1]) {
    mensajeGanador.textContent = "🎉 ¡Jugador 2 ha ganado la partida!";
  } else {
    mensajeGanador.textContent = "🤝 ¡Es un empate!";
  }
}
/*--------------------------------------------------------------------------------*/




/* POPUPs */ 
/*--------------------------------------------------------------------------------*/

const showPopup = document.querySelector('.show-popup');
const popupContainer = document.querySelector('.popup-container');
const closeBtn = document.querySelector('.close-btn');



showPopup.onclick = () => {
  popupContainer.classList.add('active');
};

closeBtn.onclick = () => {
  popupContainer.classList.remove('active');
}


/* EXPLOSION */
/*----------------------------------------------------------------------------------------------------*/
 
const svg = document.getElementById("mapa-ecuador");

/**
 * Muestra un GIF de explosión centrado sobre la provincia clickeada.
 * @param {SVGPathElement} provEl  Path de la provincia
 * @param {string} gifUrl          Ruta al GIF (cámbiala si hace falta)
 * @param {number} ms              Duración visible antes de remover
 */
function boomOnProvince(provEl, gifUrl = "../MULTIMEDIA/imagenes/explosion.t.gif", ms = 900){
  
  const rect = provEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top  + rect.height / 2;

  const img = document.createElement("img");
  img.src = gifUrl;          
  img.className = "explosion";
  img.style.left = `${cx}px`;
  img.style.top  = `${cy}px`;

  document.body.appendChild(img);
  setTimeout(() => img.remove(), ms);
}

function verificarRespuesta(seleccionada) {
  if (seleccionada === preguntaActual.correcta) {
    //  Muestra la explosión 
    boomOnProvince(provinciaActual);

    playExplosion();

    provinciaActual.classList.add(`conquistado-${turno}`);
    puntajes[turno] += 1;
    actualizarPuntajes();

    setTimeout(() => {
      alert("✅ ¡Correcto! Provincia conquistada.");
    }, 600); 

    if (verificarFinJuego()) return; // puedes dejarlo igual
    // Mantiene el turno
  } else {
    // También puedes retrasar este alert para evitar “pausa” brusca
    setTimeout(() => {
      alert(`❌ Incorrecto. La respuesta correcta era: ${preguntaActual.correcta}.`);
    }, 100);

    // Cambia de turno solo si falló (como ya hacías)
    turno = turno === 1 ? 2 : 1;
  }

  turnoDisplay.textContent = `Jugador ${turno}`;
  contPregunta.classList.add("oculto");
  preguntaAbierta = false;
}
