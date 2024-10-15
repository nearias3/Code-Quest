import Phaser from "phaser";
import { loginUser } from "../utils/authService";
import { signupUser } from "../utils/authService";


class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.username = "";
    this.password = "";
  }

  preload() {
    // Load assets (sprites, images, etc.)
    console.log("GameScene: preload");
  }

  create() {
    console.log("GameScene: create");
    this.add
      .text(400, 100, "Wizard's Apprentice: Pieces of the Master", {
        fontSize: "28px",
        fill: "#fff",
      })
      .setOrigin(0.5);

    // Menu options
    this.menuOptions = [
      { text: "New Game", action: () => this.startNewGame() },
      { text: "Load Game", action: this.loadGame.bind(this) },
      { text: "Login", action: this.showLoginForm.bind(this) },
      { text: "Settings", action: this.openSettings.bind(this) },
      { text: "Exit", action: this.exitGame.bind(this) },
    ];

    // Create menu text objects and set them interactive
    this.menuText = this.menuOptions.map((option, index) => {
      const text = this.add
        .text(400, 200 + index * 50, option.text, {
          fontSize: "24px",
          fill: "#fff",
        })
        .setOrigin(0.5)
        .setInteractive(); // Make the text interactive

      // Add hover events
      text.on("pointerover", () => {
        text.setFill("#ff0"); // Highlight on hover
      });

      text.on("pointerout", () => {
        text.setFill("#fff"); // Remove highlight
      });

      // Add left click event
      text.on("pointerdown", () => option.action()); // Call the associated action
      return text;
    });

    // Add full-screen button
    this.fullscreenButton = this.add
      .text(750, 550, "[]", { fontSize: "24px", fill: "#fff" }) // Use brackets for the button
      .setOrigin(0.5)
      .setInteractive()
      .setPadding(5);

    this.fullscreenButton.on("pointerover", () => {
      this.fullscreenButton.setFill("#ff0"); // Highlight on hover
    });

    this.fullscreenButton.on("pointerout", () => {
      this.fullscreenButton.setFill("#fff"); // Remove highlight
    });

    this.fullscreenButton.on("pointerdown", () => {
      this.toggleFullscreen(); // Toggle fullscreen
    });
  }

  toggleFullscreen() {
    const canvas = this.game.canvas;

    if (!document.fullscreenElement) {
      canvas.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  showLoginForm() {
    // Add a form to contain the login inputs and button
    const loginForm = this.add.dom(400, 250).createFromHTML(`
    <form id="login-form" style="background-color: rgba(0, 0, 0, 0.8); padding: 20px; border-radius: 10px; text-align: center;">
      <input type="text" placeholder="Username" id="username" style="padding: 10px; width: 100%; margin-bottom: 10px; border-radius: 5px; border: none;">
      <input type="password" placeholder="Password" id="password" style="padding: 10px; width: 100%; margin-bottom: 10px; border-radius: 5px; border: none;">
      <button type="submit" id="login-btn" style="padding: 10px 20px; border-radius: 5px; background-color: #ffbf00; color: #000; border: none;">Login</button>
      <p style="margin-top: 10px; color: #fff;">Don’t have an account? <a href="#" id="signup-link" style="color: #ffbf00; cursor: pointer;">Sign up here</a></p>
    </form>
    
  `);

    // Add form submit event listener
    loginForm.addListener("submit").on("submit", (event) => {
      event.preventDefault(); // Prevent page refresh
      console.log("Login form submitted");

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      this.attemptLogin(username, password); // Trigger login attempt
    });

    // Handle the "Sign up" link click to show signup form
    const signupLink = document.getElementById("signup-link");
    signupLink.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent page refresh
      this.showSignupForm(); // Switch to the signup form
    });
  }

  showSignupForm() {
    // Add a signup form
    const signupForm = this.add.dom(400, 250).createFromHTML(`
    <form id="signup-form" style="background-color: rgba(0, 0, 0, 0.8); padding: 20px; border-radius: 10px; text-align: center;">
      <input type="text" placeholder="Username" id="signup-username" style="padding: 10px; width: 100%; margin-bottom: 10px; border-radius: 5px; border: none;">
      <input type="email" placeholder="Email" id="signup-email" style="padding: 10px; width: 100%; margin-bottom: 10px; border-radius: 5px; border: none;">
      <input type="password" placeholder="Password" id="signup-password" style="padding: 10px; width: 100%; margin-bottom: 10px; border-radius: 5px; border: none;">
      <button type="submit" id="signup-btn" style="padding: 10px 20px; border-radius: 5px; background-color: #ffbf00; color: #000; border: none;">Sign Up</button>
      <p style="margin-top: 10px; color: #fff;">Already have an account? <a href="#" id="login-link" style="color: #ffbf00; cursor: pointer;">Log in here</a></p>
    </form>
  `);

    // Handle form submit for signup
    signupForm.addListener("submit").on("submit", (event) => {
      event.preventDefault(); // Prevent page refresh
      const username = document.getElementById("signup-username").value;
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;

      this.attemptSignup(username, email, password); // Trigger signup attempt
    });

    // Handle the "Log in" link click to show login form again
    const loginLink = document.getElementById("login-link");
    loginLink.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent page refresh
      this.showLoginForm(); // Switch back to the login form
    });
  }

  // Add signup attempt similar to login attempt
  async attemptSignup(username, email, password) {
    try {
      const { data } = await signupUser(username, email, password);

      // On successful signup
      localStorage.setItem("token", data.signup.token);
      console.log("Signup successful, token stored.");
      this.scene.start("WorldMapScene"); // Start the game after successful signup
    } catch (error) {
      console.error("Signup failed", error);
      this.add
        .text(400, 400, "Signup failed. Please try again.", {
          fontSize: "18px",
          fill: "#ff0000",
        })
        .setOrigin(0.5);
    }
  }

  async attemptLogin(username, password) {
    try {
      const { data } = await loginUser(username, password); // Calls the login function

      // On successful login
      localStorage.setItem("token", data.login.token);
      console.log("Login successful, token stored.");

      // Emit the login event so React can respond
      this.events.emit("loginEvent");

      this.scene.start("WorldMapScene"); // Start the game after successful login
    } catch (error) {
      console.error("Login failed", error);
      this.add
        .text(400, 400, "Login failed. Please try again.", {
          fontSize: "18px",
          fill: "#ff0000",
        })
        .setOrigin(0.5);
    }
  }

  startNewGame() {
    console.log("Start New Game clicked!");
    this.scene.start("WorldMapScene"); // Start the game
  }

  loadGame() {
    console.log("Load Game clicked!");
    // Implement load game functionality
  }

  openSettings() {
    console.log("Settings clicked!");
    // Implement settings functionality
  }

  exitGame() {
    console.log("Exit clicked!");
    // Implement exit game functionality
  }

  update() {
    // Game loop logic (if any)
  }
}

class WorldMapScene extends Phaser.Scene {
  constructor() {
    super({ key: "WorldMapScene" });
  }

  preload() {
    // Load assets for the world map
    this.load.image("placeholderWorldMap", "src/assets/placeholderWorldMap.png"); // Update the path
    this.load.image("placeholderCharacter", "src/assets/placeholderCharacter.png"); // Ensure you load your player sprite here
  }

  create() {
    // Add the world map image
    const mapImage = this.add.image(400, 300, "placeholderWorldMap"); // Center it in the canvas
    mapImage.setDisplaySize(this.cameras.main.width, this.cameras.main.height); // Resize to fit the screen

    this.add
      .text(400, 50, "Dimension of Magic", { fontSize: "32px", fill: "#fff" })
      .setOrigin(0.5);

    // Create the player sprite
    this.player = this.physics.add.sprite(400, 300, "placeholderCharacter");
    this.player.setCollideWorldBounds(true); // Prevents the player from going out of bounds

    const scaleFactor = 0.1; // Adjust this factor to make the sprite smaller
    this.player.setDisplaySize(
      this.player.width * scaleFactor,
      this.player.height * scaleFactor
    );

    // Create battle instances
    this.battleZone = this.add.zone(500, 300, 100, 100).setOrigin(0);
    this.battleZone.setInteractive();

    this.battleZone.on("pointerdown", () => {
      this.scene.start("BattleScene");
    });

    // Setup keyboard controls for WASD
    this.cursors = this.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  update() {
    // Handle player movement with WASD
    if (this.cursors.a.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.d.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.w.isDown) {
      this.player.setVelocityY(-160);
    } else if (this.cursors.s.isDown) {
      this.player.setVelocityY(160);
    } else {
      this.player.setVelocityY(0);
    }
  }
}

class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: "BattleScene" });
  }

  preload() {
    // Load battle assets
  }

  create() {
    this.add
      .text(400, 300, "Battle Scene", { fontSize: "32px", fill: "#fff" })
      .setOrigin(0.5);
    // Setup battle mechanics
  }

  update() {
    // Handle battle logic
  }
}

export { GameScene, WorldMapScene, BattleScene };
export default GameScene;