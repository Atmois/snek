// Canvas Specs
const block = 25;
const rows = 15;
const columns = 15;
var board;
var ctx;

// Snake Position
var snekX = Math.floor(Math.random() * columns) * block;
var snekY = Math.floor(Math.random() * rows) * block;

// Default Snake Velocity
var velocityX = 0;
var velocityY = 0;

// Misc
var snekBody = [];
var score = 0;
var alive = true;

window.onload = function () {
    snekGame = document.getElementById("snekGame");
    scoreTxt = document.getElementById("scoreTxt");
    toggleViewModeBtn = document.getElementById("toggleDarkMode");

    resizeCanvas();

    ctx = snekGame.getContext("2d");

    randomFud();
    document.addEventListener("keydown", changeDir);
    window.addEventListener("resize", resizeCanvas);
    toggleViewModeBtn.addEventListener("click", toggleDarkMode);

    setInterval(redraw, 100);
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

// Scale based on screensize
function resizeCanvas() {
    snekGame.width = Math.min(window.innerWidth, columns * block);
    snekGame.height = Math.min(window.innerHeight, rows * block);
}

function redraw() {
    if (!alive) return;

    ctx.clearRect(0, 0, snekGame.width, snekGame.height);

    ctx.fillStyle = "red";
    ctx.fillRect(fudX, fudY, block, block);

    // Scoring
    if (snekX == fudX && snekY == fudY) {
        snekBody.push([fudX, fudY]);
        score++;
        scoreTxt.innerText = "Score: " + score;
        randomFud();
    }

    // Snek movement & generation
    for (let i = snekBody.length - 1; i > 0; i--) {
        snekBody[i] = snekBody[i - 1];
    }
    if (snekBody.length) {
        snekBody[0] = [snekX, snekY];
    }
    ctx.fillStyle = "green";
    snekX += velocityX * block;
    snekY += velocityY * block;
    ctx.fillRect(snekX, snekY, block, block);
    for (let i = 0; i < snekBody.length; i++) {
        ctx.fillStyle = "lime";
        ctx.fillRect(snekBody[i][0], snekBody[i][1], block, block);
    }

    // Death by out of bounds
    if (snekX < 0 || snekX >= columns * block || snekY < 0 || snekY >= rows * block) {
        alive = false;
        displayGameOver();
        return;
    }

    // Death by crashing into self
    for (let i = 0; i < snekBody.length; i++) {
        if (snekX == snekBody[i][0] && snekY == snekBody[i][1]) {
            alive = false;
            displayGameOver();
            return;
        }
    }
}

// The popup for when the player dies
function displayGameOver() {
    // Game over text
    ctx.fillStyle = "black";
    ctx.font = "50px AtkinsonHyperlegible";
    var text = "Game Over";
    var textWidth = ctx.measureText(text).width;
    var x = (snekGame.width - textWidth) / 2;
    var y = snekGame.height / 2;
    ctx.fillText(text, x, y);

    // Reset Button
    if (!document.querySelector(".reset-button")) {
        var resetButton = document.createElement("button");
        resetButton.innerText = "Reset";
        resetButton.className = "button reset-button";
        document.body.appendChild(resetButton);
        resetButton.addEventListener("click", resetGame);
    }
}

function resetGame() {
    // Reset specs
    snekX = Math.floor(Math.random() * columns) * block;
    snekY = Math.floor(Math.random() * rows) * block;
    velocityX = 0;
    velocityY = 0;
    snekBody = [];
    score = 0;
    scoreTxt.innerText = "Score: " + score;
    alive = true;

    // Hide button
    var resetButton = document.querySelector(".reset-button");
    if (resetButton) {
        resetButton.remove();
    }

    // Restart the game
    randomFud();
    redraw();
}

// Takes inputs and changes snek direction based on it
function changeDir(e) {
    switch (e.code) {
        case "ArrowUp":
            if (velocityY != 1) {
                velocityY = -1;
                velocityX = 0;
            }
            break;
        case "ArrowDown":
            if (velocityY != -1) {
                velocityY = 1;
                velocityX = 0;
            }
            break;
        case "ArrowLeft":
            if (velocityX != 1) {
                velocityX = -1;
                velocityY = 0;
            }
            break;
        case "ArrowRight":
            if (velocityX != -1) {
                velocityX = 1;
                velocityY = 0;
            }
            break;
    }
}

// Randomly positions the fud on the canvas
function randomFud() {
    do {
        fudX = Math.floor(Math.random() * columns) * block;
        fudY = Math.floor(Math.random() * rows) * block;
    } while (inSnek(fudX, fudY));
}

// Prevents food being spawned under the snek
function inSnek(x, y) {
    for (let i = 0; i < snekBody.length; i++) {
        if (snekBody[i][0] === x && snekBody[i][1] === y) {
            return true;
        }
    }
    return false;
}