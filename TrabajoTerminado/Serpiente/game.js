//Elementos de HTML
const tablero = document.getElementById("tableroJuego");
const puntuacion = document.getElementById("puntuacion");
const puntuacionMax = document.getElementById("puntuacionMax");
const botonStart = document.getElementById("start");
const imagenGameOver = document.getElementById("gameOver");
const contenedorTablero= document.getElementById("contenedor")
//Settings del Juego
const sizeTablero = 10;
var velocidadJuego = 300;
const tiposCuadrado = {
  vacio: 0,
  serpiente: 1,
  comida: 2,
};

const direcciones = {
  ArrowUp: -10,
  ArrowDown: 10,
  ArrowRight: 1,
  ArrowLeft: -1,
};
//Variables del juego
var snake;
var score;
var scoreMax='';
var direction;
var cuadroTablero;
var cuadroVacio;
var intervaloMovimiento;

const crearComidaAleatoria = () => {
  const lugarVacioRandom =
    cuadroVacio[Math.floor(Math.random() * cuadroVacio.length)];
  dibujarCuadrado(lugarVacioRandom, "comida");
};
const actualizarScore = () => {
  puntuacion.innerHTML = score;
  puntuacionMax.innerHTML = scoreMax;
  if(score>scoreMax){
    scoreMax=score;
    puntuacionMax.innerHTML = scoreMax;
  }
};
const colocarSerpiente = () => {
  snake.forEach((cuadrado) => dibujarCuadrado(cuadrado, "serpiente"));
};
//Dibuja los cuadrados en el tablero de juego
//@params
//cuadrados:posicion del cuadrado
//type: tipos de cuadrados (vacio, Serpiente,Comida)
const dibujarCuadrado = (cuadrado, tipo) => {
  const [fila, columna] = cuadrado.split("");
  cuadroTablero[fila][columna] = tiposCuadrado[tipo];
  const elementoCuadrado = document.getElementById(cuadrado);
  elementoCuadrado.setAttribute("class", `cuadrado ${tipo}`);
  if (tipo === "vacio") {
    cuadroVacio.push(cuadrado);
  } else {
    if (cuadroVacio.indexOf(cuadrado) !== -1) {
      cuadroVacio.splice(cuadroVacio.indexOf(cuadrado), 1);
    }
  }
};

const movimientoSerpiente = () => {
  const nuevoCuadrado = String(
    Number(snake[snake.length - 1]) + direcciones[direction]
  ).padStart(2, "0");
  const [row, colum] = nuevoCuadrado.split("");

  if (
    nuevoCuadrado < 0 ||
    nuevoCuadrado > sizeTablero * sizeTablero ||
    (direction === "ArrowRight" && colum == 0) ||
    (direction === "ArrowLeft" && colum == 9) ||
    cuadroTablero[row][colum] === tiposCuadrado.serpiente
  ) {
    gameOver();
  } else {
    snake.push(nuevoCuadrado);
    if (cuadroTablero[row][colum] === tiposCuadrado.comida) {
      cojerComida();
    } else {
      const cuadroVacio = snake.shift();
      dibujarCuadrado(cuadroVacio, "vacio");
    }
    colocarSerpiente();
  }
};
const cojerComida = () => {
  score++;
  velocidadJuego -=5;
  clearInterval(intervaloMovimiento);
  intervaloMovimiento = setInterval(
    () => movimientoSerpiente(),
    velocidadJuego
  );
  console.log(velocidadJuego);
  actualizarScore();
  crearComidaAleatoria();
};

const gameOver = () => {
  imagenGameOver.style.display = "block";
  clearInterval(intervaloMovimiento);
  velocidadJuego=300;
  botonStart.style.display = "block";
};

const setDireccion = (newDirection) => {
  direction = newDirection;
};

const eventoDireccion = (key) => {
  console.log(key.code);
  switch (key.code) {
     case "ArrowDown":
      direction != "ArrowUp" && setDireccion(key.code);
      break;
      
      case "ArrowUp":
      direction != "ArrowDown" && setDireccion(key.code);
      break;
   
    case "ArrowRight":
      direction != "ArrowLeft" && setDireccion(key.code);
      break;
    case "ArrowLeft":
      direction != "ArrowRight" && setDireccion(key.code);
      break;
  }
};

const crearTablero = () => {
  cuadroTablero.forEach((row, rowIndex) => {
    row.forEach((colum, columIndex) => {
      const valorCuadrado = `${rowIndex}${columIndex}`;
      const elementoCuadrado = document.createElement("div");
      elementoCuadrado.setAttribute("class", "cuadrado vacio");
      elementoCuadrado.setAttribute("id", valorCuadrado);
      tablero.appendChild(elementoCuadrado);
      cuadroVacio.push(valorCuadrado);
    });
  });
};

const setGame = () => {
  snake = ["10", "11", "12"];
  score = snake.length;  
  direction = "ArrowRight";
  cuadroTablero = Array.from(Array(sizeTablero), () =>
    new Array(sizeTablero).fill(tiposCuadrado.vacio)
  );
  console.log(cuadroTablero);
  tablero.innerHTML = "";
  cuadroVacio = [];
  crearTablero();
};
const startGame = () => {
  setGame();
  imagenGameOver.style.display = "none";
  botonStart.style.display = "none";
  contenedorTablero.style.display="block"
  colocarSerpiente();
  actualizarScore();
  crearComidaAleatoria();
  document.addEventListener("keydown", eventoDireccion);
  intervaloMovimiento = setInterval(
    () => movimientoSerpiente(),
    velocidadJuego
  );
};

botonStart.addEventListener("click", startGame);
