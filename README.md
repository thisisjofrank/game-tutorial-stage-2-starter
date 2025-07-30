# 🦕 Dino Runner Game - Stage 2 Starter

Welcome to Stage 2 of the Dino Runner Game tutorial! Having built the foundation
in Stage 1, you'll now transform your static landing page into an interactive
game with HTML5 Canvas.

## What you'll build in this stage

By the end of Stage 2, you'll have:

- ✅ HTML5 Canvas game rendering area
- ✅ Animated dino character with jump mechanics
- ✅ Physics system with gravity and collision detection
- ✅ Keyboard and mouse input handling
- ✅ Game loop with smooth 60fps animation
- ✅ Score tracking and game state management
- ✅ Responsive game UI with visual controls guide

## Getting started

### Prerequisites

- Completed Stage 1 (or cloned Stage 1 as your foundation)
- [Deno](https://deno.com/) installed on your system
- A code editor (VS Code recommended)
- Basic knowledge of TypeScript/JavaScript and HTML5 Canvas

### Setup

1. Copy your Stage 1 project or deploy this starter kit:
   [![Deploy on Deno](https://deno.com/button)](https://app.deno.com/new?clone=https://github.com/thisisjofrank/game-tutorial-stage-2-starter.git&install=deno+install&entrypoint=src/main.ts&mode=dynamic)
2. Ensure your `.env` file is configured
3. Install dependencies: `deno install`

## Transforming the landing page into a game

### Update the HTML for game canvas

We're going to build on our `public/index.html`, to take it from a simple
landing page to a full game interface centered around an HTML5 Canvas element.

The canvas will be our game's "screen" where we draw the dino character, ground,
and everything else. Think of it like a digital painting canvas that we can
programmatically draw on.

We'll also add a section to show players which controls they can use to play the
game.

Add a `<canvas>` element into your HTML page with the following markup. (You can
delete the first `<section>` element from Stage 1 and replace it with these new
elements):

<details>
<summary>📁 public/index.html (click to expand)</summary>

```html
<!-- The game canvas - this is where all the magic happens! -->
<section class="container canvas-container">
  <canvas id="gameCanvas" width="800" height="200"></canvas>
  <div class="game-ui">
    <div class="score">Score: <span id="score">0</span></div>
    <div class="game-status" id="gameStatus">Click to Start!</div>
  </div>
</section>

<!-- Visual guide showing players how to control the game -->
<section class="container">
  <h3>🎮 Controls</h3>
  <div class="control-grid">
    <kbd>Space</kbd>
    <kbd>↑</kbd>
    <span class="click">🖱️ Click</span>
    <span>Jump</span>
    <span>Jump</span>
    <span>Start/Jump</span>
  </div>
</section>
```

The `<canvas>` element is where we'll draw our game graphics. The `id`
`gameCanvas` will be used in our JavaScript to access the canvas context for
drawing.

The `.game-ui` div will display the current score and game status. The
`.control-grid` section provides a visual guide for players on how to control
the game.

`<kbd>` elements are used to visually represent keyboard keys, making it clear
to players how to control the game. The `click` class is for mouse/touch input

</details>

### Enhance the CSS for game styling

We need to update our CSS to support the new game interface, making the canvas
responsive and styling the game UI elements.

Copy the enhanced styles from
[this CSS file](https://raw.githubusercontent.com/thisisjofrank/game-tutorial-stage-2/refs/heads/main/public/css/styles.css)
and add them to your `public/css/styles.css`.

### Build the game engine

Now comes the exciting part! We'll transform our simple JavaScript health check
into a complete game engine. This is where the dino character comes to life.

<details>
<summary>📁 public/js/game.js (click to expand)</summary>

```javascript
// Stage 2: Dino Runner Game with Canvas and Basic Controls
console.log("🦕 Stage 2: Canvas and Basic Controls loaded!");

// Main game class that handles all game logic
class DinoGame {
  constructor() {
    // Get references to HTML elements we'll use
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d"); // This is how we draw on the canvas
    this.scoreElement = document.getElementById("score");
    this.statusElement = document.getElementById("gameStatus");

    // Game state management
    this.gameState = "waiting"; // 'waiting', 'playing', 'gameOver'
    this.score = 0;
    this.gameSpeed = 2;

    // Dino character properties - position, size, and physics
    this.dino = {
      x: 50, // Horizontal position (pixels from left)
      y: 150, // Vertical position (pixels from top)
      width: 40, // Width of the dino sprite
      height: 40, // Height of the dino sprite
      velocityY: 0, // Vertical speed (for jumping/falling)
      isJumping: false, // Track if dino is in the air
      groundY: 150, // Y position when dino is on the ground
    };

    // Physics constants that make the game feel realistic
    this.gravity = 0.6; // How fast the dino falls back down
    this.jumpStrength = -12; // How powerful the jump is (negative = upward)

    // Ground level for drawing
    this.groundY = 180;

    // Start the game!
    this.init();
  }

  // Initialize the game and start the main loop
  init() {
    this.setupEventListeners(); // Set up keyboard and mouse controls
    this.gameLoop(); // Start the main game loop
    this.updateStatus("Click to Start!"); // Show initial message
  }

  // Set up all the ways players can control the game
  setupEventListeners() {
    // Keyboard controls - Space bar and up arrow both make the dino jump
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault(); // Prevent page scrolling
        this.handleJump();
      }
    });

    // Mouse/touch controls - clicking the canvas also makes the dino jump
    this.canvas.addEventListener("click", () => {
      this.handleJump();
    });

    // Extra prevention of space bar scrolling the page
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault();
      }
    });
  }

  // Handle all jump actions - this method decides what happens based on game state
  handleJump() {
    if (this.gameState === "waiting") {
      // If game hasn't started, start it
      this.startGame();
    } else if (this.gameState === "playing" && !this.dino.isJumping) {
      // If game is running and dino is on ground, jump
      this.jump();
    } else if (this.gameState === "gameOver") {
      // If game is over, restart it
      this.resetGame();
    }
  }

  // Start a new game
  startGame() {
    this.gameState = "playing";
    this.score = 0;
    this.updateScore();
    this.updateStatus(""); // Clear the status message
    console.log("🎮 Game started!");
  }

  // Make the dino jump by giving it upward velocity
  jump() {
    if (!this.dino.isJumping) {
      this.dino.velocityY = this.jumpStrength; // Apply upward force
      this.dino.isJumping = true; // Mark as jumping
      console.log("🦘 Dino jumped!");
    }
  }

  // Physics simulation - this makes the dino fall realistically
  updatePhysics() {
    if (this.gameState !== "playing") return; // Only update physics during gameplay

    // Apply gravity - gradually increase downward velocity
    this.dino.velocityY += this.gravity;

    // Update position based on velocity
    this.dino.y += this.dino.velocityY;

    // Ground collision detection - stop the dino from falling through the ground
    if (this.dino.y >= this.dino.groundY) {
      this.dino.y = this.dino.groundY; // Put dino exactly on ground
      this.dino.velocityY = 0; // Stop falling
      this.dino.isJumping = false; // Mark as landed
    }

    // Increase score while playing - this gives continuous scoring
    this.score += 0.1;
    this.updateScore();
  }

  // The main game loop - this runs 60 times per second
  gameLoop() {
    this.updatePhysics(); // Update dino position and physics
    this.render(); // Draw everything on the canvas

    // Schedule the next frame - this creates smooth animation
    requestAnimationFrame(() => this.gameLoop());
  }

  // Draw everything on the canvas
  render() {
    // Clear the entire canvas - like erasing a whiteboard
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw the ground line
    this.ctx.strokeStyle = "#8B4513"; // Brown color
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.groundY); // Start at left edge
    this.ctx.lineTo(this.canvas.width, this.groundY); // Draw to right edge
    this.ctx.stroke();

    // Draw the dino character
    this.drawDino();
  }

  // Draw the dino character as a simple rectangle (for now)
  drawDino() {
    // Set dino color based on game state
    if (this.gameState === "waiting") {
      this.ctx.fillStyle = "#666"; // Gray when waiting
    } else {
      this.ctx.fillStyle = "#228B22"; // Green when playing
    }

    // Draw the dino as a rectangle
    this.ctx.fillRect(
      this.dino.x, // X position
      this.dino.y, // Y position
      this.dino.width, // Width
      this.dino.height, // Height
    );

    // Add a simple face to make it more dino-like
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(this.dino.x + 5, this.dino.y + 5, 8, 8); // Eye
    this.ctx.fillRect(this.dino.x + 20, this.dino.y + 5, 8, 8); // Other eye
  }

  // Update the score display on the webpage
  updateScore() {
    this.scoreElement.textContent = Math.floor(this.score);
  }

  // Update the status message (like "Game Over" or "Click to Start")
  updateStatus(message) {
    this.statusElement.textContent = message;
  }

  // Reset the game to start over
  resetGame() {
    this.dino.y = this.dino.groundY;
    this.dino.velocityY = 0;
    this.dino.isJumping = false;
    this.score = 0;
    this.gameState = "waiting";
    this.updateScore();
    this.updateStatus("Click to Start!");
    console.log("🔄 Game reset!");
  }
}

// Start the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const game = new DinoGame();
});

// Still keep our health check from Stage 1
async function checkHealth() {
  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    console.log("🎉 Server health check:", data);
  } catch (error) {
    console.error("❌ Health check failed:", error);
  }
}

checkHealth();
console.log("📋 Stage 2: Game canvas, physics, and controls implemented!");
console.log(
  "🎯 Next: Stage 3 will add obstacles, collision detection, and game over mechanics",
);
```

The `DinoGame` class encapsulates all game logic, making code organized and
reusable

`this.ctx` is our drawing tool, it allows us to draw on the canvas

The `gameLoop()` runs continuously, updating and redrawing everything 60 times
per second. Game loops are a fundamental concept in game development, allowing
for smooth animations and real-time interactions.

We have built out a game engine. In game development, the game engine is the
core system that manages all aspects of the game, including rendering graphics,
handling input, and simulating physics.

`updatePhysics()` simulates gravity and collision with realistic movement using
basic physics principles.

`handleJump()` manages player input for jumping, starting the game, or
restarting it

`drawDino()` renders the dino character on the canvas, (including a cute face!)

`updateScore()` updates the score display on the webpage

`updateStatus()` changes the game status message shown to players

The game state is managed with a simple string (`waiting`, `playing`,
`gameOver`), allowing us to control what happens based on player actions.

We use state management to track whether the game is waiting for input, actively
playing, or has ended. This allows us to control game flow and player
interactions effectively.

The rendering system draws the game elements on the canvas, including the dino
character and ground line. The `render()` method is called every frame to update
visuals based on the current game state.

</details>

## Understanding the game architecture

### The game loop

The heart of any game is its **game loop** - a cycle that runs continuously
while the game is active it will:

1. **Update**: Calculate new positions, check for collisions, update score
2. **Render**: Draw everything on the canvas based on current state
3. **Repeat**: Use `requestAnimationFrame` to schedule the next cycle

This creates smooth 60fps animation that responds to player input in real-time.

### Physics system

Our physics system simulates realistic movement:

- **Gravity**: Constantly pulls the dino downward with `this.gravity = 0.6`
- **Jump Force**: Applies upward velocity with `this.jumpStrength = -12`
- **Collision**: Detects when the dino hits the ground and stops falling
- **Velocity**: Tracks speed in the Y direction for smooth motion

### Input handling

We support multiple input methods:

- **Keyboard**: Space bar and up arrow for traditional gaming
- **Mouse/Touch**: Click or tap for mobile and casual players
- **State-Aware**: Different behaviors based on current game state

### Canvas rendering

The HTML5 Canvas API lets us draw programmatically:

- **Context**: `getContext("2d")` gives us drawing tools
- **Clear**: `clearRect()` erases the previous frame
- **Draw**: Use methods like `fillRect()` and `stroke()` to create visuals
- **Coordinates**: (0,0) is top-left, Y increases downward

## Testing your game

1. **Start the server**:

   ```bash
   deno task dev
   ```

2. **Open your browser**: Navigate to
   [http://localhost:8000](http://localhost:8000)

3. **Test controls**:
   - Click the canvas to start
   - Press Space or ↑ to jump
   - Watch the score increase
   - Observe realistic physics

4. **Check the console**: Open browser DevTools to see helpful debug messages

## Deploying your game

Commit your changes and push them to your GitHub repository and Deno Deploy will
automatically deploy your project. At this point you'll have a movable character
that can jump based on user input, and a score that increases over time.

## Make it your own

You can of course edit the game physics if you want, to make the dino jump
higher, or fall faster. You can also change the dino's color, or add more
features like power-ups or obstacles. Test it out and see how it feels!

## Learning objectives completed

After completing Stage 2, you should understand:

- [x] **HTML5 Canvas**: How to create a drawing surface for games
- [x] **Game Loops**: The update-render cycle that drives game animation
- [x] **Physics Simulation**: Implementing gravity and collision detection
- [x] **Input Handling**: Responding to keyboard and mouse events
- [x] **State Management**: Tracking game states (waiting, playing, game over)
- [x] **Animation**: Using `requestAnimationFrame` for smooth 60fps movement
- [x] **Object-Oriented Design**: Organizing game code with classes and methods

## Ready for Stage 3?

Excellent work! You now have a jumping dino character with realistic physics. In
Stage 3, you'll add:

- Moving obstacles (cacti) that the dino must avoid
- Collision detection between dino and obstacles
- Game over mechanics when collisions occur
- Restart functionality to play again
- Enhanced visual effects and animations

**Continue to:**
[Stage 3 Starter](https://github.com/thisisjofrank/game-tutorial-stage-3-starter)

The foundation is solid - now let's make it a real game! 🦕✨
