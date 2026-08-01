const gameArea = document.getElementById("gameArea");
const scoreValue = document.getElementById("scoreValue");
const timeValue = document.getElementById("timeValue");
const bestValue = document.getElementById("bestValue");
const gameMessage = document.getElementById("gameMessage");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

// ---------- 2. GAME STATE VARIABLES ----------
let score = 0;
let timeLeft = 30;          // total game length in seconds
let bestScore = 0;
let gameTimerId = null;     // stores the setInterval ID for the countdown
let bubbleSpawnerId = null; // stores the setInterval ID for creating bubbles
let isGameRunning = false;

// Load the player's best score from a previous visit, if the browser
// supports localStorage (works even without any backend/database).
if (window.localStorage) {
  const savedBest = localStorage.getItem("mindcareBubbleBestScore");
  if (savedBest) {
    bestScore = parseInt(savedBest, 10);
    bestValue.textContent = bestScore;
  }
}

// ---------- 3. CREATE A SINGLE BUBBLE ----------
function createBubble() {
  const bubble = document.createElement("button");
  bubble.classList.add("bubble");
  bubble.setAttribute("aria-label", "Pop bubble");

  // Randomize bubble size a little, so the game feels more natural
  const size = Math.floor(Math.random() * 30) + 40; // between 40px and 70px
  bubble.style.width = size + "px";
  bubble.style.height = size + "px";

  // Randomize the horizontal starting position within the game area
  const areaWidth = gameArea.clientWidth;
  const maxLeft = areaWidth - size;
  const randomLeft = Math.floor(Math.random() * maxLeft);
  bubble.style.left = randomLeft + "px";

  // Randomize how long it takes the bubble to float to the top
  const riseDuration = Math.random() * 2 + 3; // between 3s and 5s
  bubble.style.animationDuration = riseDuration + "s";

  // When the bubble is clicked, "pop" it and add a point
  bubble.addEventListener("click", function () {
    popBubble(bubble);
  });

  gameArea.appendChild(bubble);

  // If the bubble floats all the way up without being clicked,
  // remove it from the page so we don't build up hidden elements.
  bubble.addEventListener("animationend", function () {
    if (bubble.parentElement) {
      bubble.remove();
    }
  });
}

// ---------- 4. POP A BUBBLE (when clicked) ----------
function popBubble(bubble) {
  // Prevent double-clicking the same bubble for extra points
  if (bubble.classList.contains("pop")) return;

  bubble.classList.add("pop"); // triggers the "pop" CSS animation
  score++;
  scoreValue.textContent = score;

  // Remove the bubble from the page after its pop animation finishes
  setTimeout(function () {
    if (bubble.parentElement) {
      bubble.remove();
    }
  }, 250);
}

// ---------- 5. START THE GAME ----------
function startGame() {
  // Reset all game state back to the beginning
  score = 0;
  timeLeft = 30;
  scoreValue.textContent = score;
  timeValue.textContent = timeLeft;
  isGameRunning = true;

  // Hide the start/game-over message overlay
  gameMessage.classList.add("hidden");

  // Clear out any leftover bubbles from a previous round
  const oldBubbles = gameArea.querySelectorAll(".bubble");
  oldBubbles.forEach(function (b) { b.remove(); });

  // Create a new bubble every 700 milliseconds
  bubbleSpawnerId = setInterval(createBubble, 700);

  // Count down the timer once every second
  gameTimerId = setInterval(function () {
    timeLeft--;
    timeValue.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// ---------- 6. END THE GAME ----------
function endGame() {
  isGameRunning = false;

  // Stop creating new bubbles and stop the countdown
  clearInterval(bubbleSpawnerId);
  clearInterval(gameTimerId);

  // Remove any bubbles still on screen
  const remainingBubbles = gameArea.querySelectorAll(".bubble");
  remainingBubbles.forEach(function (b) { b.remove(); });

  // Update the best score if the player beat their previous record
  if (score > bestScore) {
    bestScore = score;
    bestValue.textContent = bestScore;
    if (window.localStorage) {
      localStorage.setItem("mindcareBubbleBestScore", bestScore);
    }
  }

  // Show the "game over" message with the final score
  gameMessage.innerHTML =
    '<i class="fa-solid fa-trophy" style="font-size:2.5rem; color:var(--color-primary-dark);"></i>' +
    "<h2>Nice job! 🎉</h2>" +
    '<p style="color:var(--color-text-light);">You popped <strong>' + score + '</strong> bubbles.</p>' +
    '<button class="btn btn-primary" id="startBtn">Play Again</button>';
  gameMessage.classList.remove("hidden");

  // Re-attach the click event to the new "Play Again" button,
  // since we just replaced it with innerHTML above.
  document.getElementById("startBtn").addEventListener("click", startGame);
}

// ---------- 7. RESTART BUTTON ----------
function restartGame() {
  // Stop any game currently in progress
  clearInterval(bubbleSpawnerId);
  clearInterval(gameTimerId);

  const remainingBubbles = gameArea.querySelectorAll(".bubble");
  remainingBubbles.forEach(function (b) { b.remove(); });

  startGame();
}

// ---------- 8. EVENT LISTENERS ----------
if (startBtn) {
  startBtn.addEventListener("click", startGame);
}

if (restartBtn) {
  restartBtn.addEventListener("click", restartGame);
}