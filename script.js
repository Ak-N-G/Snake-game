const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Responsive canvas
const boxSize = 20;
let canvasSize = Math.min(window.innerWidth, window.innerHeight) - 50;
canvas.width = canvasSize;
canvas.height = canvasSize;

let snake = [{ x: 10 * boxSize, y: 10 * boxSize }];
let direction = "RIGHT";
let food = spawnFood();
let score = 0;
let bestScore = localStorage.getItem("bestScore") || 0;
let interval = null;
let gameSpeed = 100;

// Update score display
document.getElementById("score").innerText = `Score: ${score} | Best: ${bestScore}`;

// Handle key presses for desktop users
document.addEventListener("keydown", changeDirection);

// Button controls
document.getElementById("up-btn").addEventListener("click", () => setDirection("UP"));
document.getElementById("down-btn").addEventListener("click", () => setDirection("DOWN"));
document.getElementById("left-btn").addEventListener("click", () => setDirection("LEFT"));
document.getElementById("right-btn").addEventListener("click", () => setDirection("RIGHT"));
document.getElementById("play-btn").addEventListener("click", startGame);
document.getElementById("pause-btn").addEventListener("click", pauseGame);
document.getElementById("reset-btn").addEventListener("click", resetGame);
document.getElementById("retry-btn").addEventListener("click", resetGame);
document.getElementById("speed-level").addEventListener("change", (e) => {
  gameSpeed = parseInt(e.target.value);
  if (interval) {
    clearInterval(interval);
    interval = setInterval(gameLoop, gameSpeed);
  }
});

// Swipe detection for mobile devices
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", handleTouchStart);
canvas.addEventListener("touchmove", handleTouchMove);

function handleTouchStart(e) {
  const firstTouch = e.touches[0];
  touchStartX = firstTouch.clientX;
  touchStartY = firstTouch.clientY;
}

function handleTouchMove(e) {
  if (!touchStartX || !touchStartY) {
    return;
  }

  const touchEndX = e.touches[0].clientX;
  const touchEndY = e.touches[0].clientY;

  const diffX = touchStartX - touchEndX;
  const diffY = touchStartY - touchEndY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0 && direction !== "RIGHT") {
      direction = "LEFT";
    } else if (diffX < 0 && direction !== "LEFT") {
      direction = "RIGHT";
    }
  } else {
    if (diffY > 0 && direction !== "DOWN") {
      direction = "UP";
    } else if (diffY < 0 && direction !== "UP") {
      direction = "DOWN";
    }
  }

  touchStartX = 0;
  touchStartY = 0;
}

// Keyboard and button direction change
function changeDirection(event) {
  if (event.keyCode === 37 && direction !== "RIGHT") {
    direction = "LEFT";
  } else if (event.keyCode === 38 && direction !== "DOWN") {
    direction = "UP";
  } else if (event.keyCode === 39 && direction !== "LEFT") {
    direction = "RIGHT";
  } else if (event.keyCode === 40 && direction !== "UP") {
    direction = "DOWN";
  }
}

function setDirection(newDirection) {
  if (newDirection === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  if (newDirection === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
  if (newDirection === "UP" && direction !== "DOWN") direction = "UP";
  if (newDirection === "DOWN" && direction !== "UP") direction = "DOWN";
}

function spawnFood() {
  let foodX = Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize;
  let foodY = Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize;
  return { x: foodX, y: foodY };
}

function gameLoop() {
  if (isGameOver()) {
    showGameOver();
    return;
  }

  clearCanvas();
  drawFood();
  moveSnake();
  drawSnake();

  if (didEatFood()) {
    score++;
    document.getElementById("score").innerText = `Score: ${score} | Best: ${bestScore}`;
    food = spawnFood();
  } else {
    snake.pop();
  }
}

function didEatFood() {
  return snake[0].x === food.x && snake[0].y === food.y;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, boxSize, boxSize);
}

function moveSnake() {
  let head = { x: snake[0].x, y: snake[0].y };

  if (direction === "LEFT") head.x -= boxSize;
  if (direction === "RIGHT") head.x += boxSize;
  if (direction === "UP") head.y -= boxSize;
  if (direction === "DOWN") head.y += boxSize;

  snake.unshift(head);
}

function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "green" : "lightgreen";
    ctx.fillRect(snake[i]..x, snake[i].y, boxSize, boxSize);
    ctx.strokeStyle = "darkgreen";
    ctx.strokeRect(snake[i].x, snake[i].y, boxSize, boxSize);
  }
}

function isGameOver() {
  let head = snake[0];

  // Check if the snake hits the walls
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    return true;
  }

  // Check if the snake hits itself
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

function showGameOver() {
  // Display game over and retry button
  clearInterval(interval);
  document.getElementById("retry-btn").classList.remove("hidden");
  document.getElementById("score").innerText = `Game Over! Score: ${score} | Best: ${bestScore}`;

  // Update the best score if the current score is higher
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
    document.getElementById("score").innerText = `Game Over! New Best Score: ${bestScore}`;
  }
}

function startGame() {
  if (!interval) {
    interval = setInterval(gameLoop, gameSpeed);
  }
  document.getElementById("retry-btn").classList.add("hidden");
}

function pauseGame() {
  clearInterval(interval);
  interval = null;
}

function resetGame() {
  snake = [{ x: 10 * boxSize, y: 10 * boxSize }];
  direction = "RIGHT";
  food = spawnFood();
  score = 0;
  document.getElementById("score").innerText = `Score: ${score} | Best: ${bestScore}`;
  clearInterval(interval);
  interval = setInterval(gameLoop, gameSpeed);
  document.getElementById("retry-btn").classList.add("hidden");
}
