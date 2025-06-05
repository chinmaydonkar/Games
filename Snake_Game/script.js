const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // The drawing context for the canvas
const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('score');

const gridSize = 20; // Size of each segment of the snake and food
const canvasSize = 400; // Total canvas size (width and height are equal)
const maxScore = (canvasSize / gridSize) * (canvasSize / gridSize); // Max possible score

let snake = [{ x: 10, y: 10 }]; // Initial snake position (array of segments)
let food = {}; // Food position
let dx = 0; // Horizontal movement direction
let dy = 0; // Vertical movement direction
let score = 0;
let gameOver = false;
let gameInterval; // To store the interval ID for clearing
let gameSpeed = 150; // Milliseconds for game update speed

// --- Game Initialization ---
function initGame() {
    snake = [{ x: 10, y: 10 }]; // Reset snake to initial position
    dx = 0; // No initial movement until key press
    dy = 0;
    score = 0;
    scoreDisplay.textContent = score;
    gameOver = false;
    generateFood(); // Place initial food
    clearInterval(gameInterval); // Clear any existing game interval
    startButton.textContent = 'Start Game'; // Reset button text
}

// --- Drawing Functions ---
function drawRect(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
    ctx.strokeStyle = 'black'; // Add a black border for segments
    ctx.strokeRect(x * gridSize, y * gridSize, gridSize, gridSize);
}

function drawSnake() {
    snake.forEach(segment => drawRect(segment.x, segment.y, 'lime'));
}

function drawFood() {
    drawRect(food.x, food.y, 'red');
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
}

// --- Food Generation ---
function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvasSize / gridSize)),
        y: Math.floor(Math.random() * (canvasSize / gridSize))
    };

    // Ensure food doesn't spawn on the snake
    for (let i = 0; i < snake.length; i++) {
        if (food.x === snake[i].x && food.y === snake[i].y) {
            generateFood(); // Recalculate if it overlaps
            return;
        }
    }
}

// --- Game Logic ---
function updateGame() {
    if (gameOver) return;

    // Move the snake's head
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check for wall collision
    if (
        head.x < 0 ||
        head.x >= canvasSize / gridSize ||
        head.y < 0 ||
        head.y >= canvasSize / gridSize
    ) {
        endGame();
        return;
    }

    // Check for self-collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
            return;
        }
    }

    snake.unshift(head); // Add new head to the beginning of the snake array

    // Check for food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        generateFood(); // Generate new food
        // Optionally increase speed as score increases (makes it harder)
        if (gameSpeed > 50) { // Don't go too fast
            gameSpeed -= 2;
            clearInterval(gameInterval);
            gameInterval = setInterval(updateGame, gameSpeed);
        }
    } else {
        snake.pop(); // Remove the tail if no food was eaten
    }

    if (score === maxScore) {
        alert('Congratulations! You ate all the food! You win!');
        endGame();
    }

    clearCanvas();
    drawFood();
    drawSnake();
}

// --- Game Controls ---
document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT_KEY = 37;
    const UP_KEY = 38;
    const RIGHT_KEY = 39;
    const DOWN_KEY = 40;

    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingLeft = dx === -1;
    const goingRight = dx === 1;

    // Prevent immediate reverse direction
    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    } else if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    } else if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    } else if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

// --- Game Start/End ---
function startGame() {
    if (gameOver) { // If game was over, reinitialize
        initGame();
        startButton.textContent = 'Restart Game';
    } else if (!gameInterval) { // Prevent multiple intervals if already running
        initGame();
        startButton.textContent = 'Restart Game';
    }
    gameInterval = setInterval(updateGame, gameSpeed);
}

function endGame() {
    gameOver = true;
    clearInterval(gameInterval); // Stop the game loop
    gameInterval = null; // Reset interval ID
    startButton.textContent = 'Game Over! Play Again?';
    alert('Game Over! Your score was: ' + score);
}

// Event listener for the start button
startButton.addEventListener('click', startGame);

// Initial setup
initGame();
clearCanvas();
drawFood(); // Draw initial food