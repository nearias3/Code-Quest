import Phaser from "phaser";
import { loginUser, signupUser } from "../utils/authService";


class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.isLoggedIn = false;
    this.isGameInProgress = false; // Track if the game is in progress
    this.form = null; // Initialize form as null
  }

  preload() {
    // Load assets (sprites, images, etc.)
    console.log("GameScene: preload");
  }

  create() {
    console.log("GameScene: create");
    // Check if user is logged in via token
    this.checkLoginStatus();
    this.displayMainMenu();
    this.form = null; // form reference to clear it later after signup/login
  }

  checkLoginStatus() {
    const token = localStorage.getItem("token");
    this.isLoggedIn = !!token;
  }

  displayMainMenu() {
    // Re-check login status whenever the main menu gets displayed again
    this.checkLoginStatus();

    // Clear any previous menu items
    this.children.removeAll();

    this.add
      .text(400, 100, "Wizard's Apprentice: Pieces of the Master", {
        fontSize: "28px",
        fill: "#fff",
      })
      .setOrigin(0.5);

    // Menu options, show New Game and Settings regardless of if LoggedIn or not
    const menuOptions = [
      { text: "New Game", action: this.startNewGame.bind(this) },
    ];

    // Add "Load Game" if user is logged in
    if (this.isLoggedIn) {
      menuOptions.push({
        text: "Load Game",
        action: this.showLoadSlots.bind(this),
      });

      // Add "Save Game" option if the user is logged in
      menuOptions.push({ 
        text: "Save Game", 
        action: this.saveGame.bind(this),
    });
  }
    else {
      menuOptions.push({
        text: "Login",
        action: this.showLoginForm.bind(this),
      });

      menuOptions.push({
        text: "Sign Up",
        action: this.showSignupForm.bind(this),
      });
    }

    // Add settings regardless of LoggedInStatus
    menuOptions.push({
    text: "Settings", 
    action: this.openSettings.bind(this) 
  });

    // Add "Logout" option if logged in, else nothing
    if (this.isLoggedIn) {
      menuOptions.push({ 
        text: "Logout", 
        action: this.logout.bind(this)
      });
    }

    // Create interactive menu items
    menuOptions.forEach((option, index) => {
      const text = this.add
        .text(400, 200 + index * 50, option.text, {
          fontSize: "24px",
          fill: "#fff",
        })
        .setOrigin(0.5)
        .setInteractive();

      // Add hover and click events
      text.on("pointerover", () => text.setFill("#ff0"));
      text.on("pointerout", () => text.setFill("#fff"));
      text.on("pointerdown", option.action);
    });
  }

  showLoginForm() {
    // Clear the current menu content
    this.children.removeAll();

    // Add a form to contain the login inputs and button
    this.form = this.add.dom(400, 250).createFromHTML(`
    <form id="login-form" style="background-color: rgba(0, 0, 0, 0.8); padding: 20px; border-radius: 10px; text-align: center;">
      <input type="text" placeholder="Username" id="username" style="padding: 10px; width: 100%; margin-bottom: 10px; border-radius: 5px; border: none;">
      <input type="password" placeholder="Password" id="password" style="padding: 10px; width: 100%; margin-bottom: 10px; border-radius: 5px; border: none;">
      <button type="submit" id="login-btn" style="padding: 10px 20px; border-radius: 5px; background-color: #ffbf00; color: #000; border: none;">Login</button>
      <p style="margin-top: 10px; color: #fff;">Don’t have an account? <a href="#" id="signup-link" style="color: #ffbf00; cursor: pointer;">Sign up here</a></p>
    </form>
    
  `);

    // Add form submit event listener
    this.form.addListener("submit").on("submit", (event) => {
      event.preventDefault(); // Prevent page refresh

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      this.attemptLogin(username, password); // Trigger login attempt
    });

    // Handle "Sign Up" link to switch to sign up form
    document
      .getElementById("signup-link")
      .addEventListener("click", (event) => {
        event.preventDefault();
        this.showSignupForm(); // Replace login with signup form
      });
  }

  async attemptLogin(username, password) {
    try {
      const response = await loginUser(username, password);
      console.log("Login response:", response);

      if (response && response.login && response.login.token) {
        localStorage.setItem("token", response.login.token);
        this.isLoggedIn = true; // Mark the user as logged in
        console.log("Login successful, token stored.");

        // Remove the form
        this.form.destroy();

        this.displayMainMenu(); // Go back to the main menu
      } else {
        throw new Error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login failed with error:", error);
      this.add
        .text(400, 400, "Login failed. Please try again.", {
          fontSize: "18px",
          fill: "#ff0000",
        })
        .setOrigin(0.5);
    }
  }

  // Signup method
  async attemptSignup(username, email, password) {
    try {
      const response = await signupUser(username, email, password);
      console.log("Signup response:", response);

      if (response && response.signup && response.signup.token) {
        localStorage.setItem("token", response.signup.token);
        this.isLoggedIn = true; // User is now signed up and logged in
        console.log("Signup successful, token stored.");

        // Remove the form
        this.form.destroy();

        this.displayMainMenu(); // Return to main menu
      } else {
        throw new Error("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      this.add
        .text(400, 400, "Signup failed. Please try again.", {
          fontSize: "18px",
          fill: "#ff0000",
        })
        .setOrigin(0.5);
    }
  }

  logout() {
    localStorage.removeItem("token");
    this.isLoggedIn = false; // Mark the user as logged out
    console.log("Logged out");
    this.displayMainMenu(); // Refresh the menu after logging out
  }

  // New Game logic
  startNewGame() {
    console.log("Start New Game clicked!");
    this.scene.start("WorldMapScene");
  }

  // Signup form logic
  showSignupForm() {
    // Clear the current menu content
    this.children.removeAll();

    this.form = this.add.dom(400, 250).createFromHTML(`
      <form id="signup-form" style="background-color: rgba(0, 0, 0, 0.8); padding: 20px; border-radius: 10px; text-align: center;">
        <input type="text" placeholder="Username" id="signup-username" style="padding: 10px; width: 100%; margin-bottom: 10px; border-radius: 5px;">
        <input type="email" placeholder="Email" id="signup-email" style="padding: 10px; width: 100%; margin-bottom: 10px; border-radius: 5px;">
        <input type="password" placeholder="Password" id="signup-password" style="padding: 10px; width: 100%; margin-bottom: 10px; border-radius: 5px;">
        <button type="submit" id="signup-btn" style="padding: 10px 20px; background-color: #ffbf00; color: #000; border-radius: 5px;">Sign Up</button>
      </form>
    `);

    this.form.addListener("submit").on("submit", (event) => {
      event.preventDefault();
      const username = document.getElementById("signup-username").value;
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;
      this.attemptSignup(username, email, password);
    });
  }

  async saveGame() {
    console.log("Save Game clicked!");

    // Mockup: Replace this actual game data (e.g., player stats, progress)
    const playerStats = {
      level: 5,
      health: 100,
      mana: 50,
    };

    const progress = {
      currentStage: "WorldMap",
      completedQuests: ["Placeholder Quest 1", "Placeholder Quest 2"],
    };

    try {
      // Replace this with actual API function for saving the game once we build that
      const response = await fetch("/api/save-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          playerStats,
          progress,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Game saved successfully:", result);
        this.add
          .text(400, 400, "Game Saved!", {
            fontSize: "18px",
            fill: "#00ff00",
          })
          .setOrigin(0.5);
      } else {
        throw new Error(result.message || "Failed to save game.");
      }
    } catch (error) {
      console.error("Save Game failed:", error);
      this.add
        .text(400, 400, "Failed to Save Game", {
          fontSize: "18px",
          fill: "#ff0000",
        })
        .setOrigin(0.5);
    }
  }

  openSettings() {
    console.log("Settings clicked!");
    // Any settings functionalities should be implemented here!!
  }

  // Load game slots
  showLoadSlots() {
    this.children.removeAll(); // Clear screen
    const saveSlots = [1, 2, 3];
    saveSlots.forEach((slot, index) => {
      this.add
        .text(400, 300 + index * 50, `Load Slot ${slot}`, { fill: "#fff" })
        .setInteractive()
        .on("pointerdown", () => this.loadGame(slot));
    });
  }

  // Load game method
  loadGame(slotNumber) {
    console.log(`Load game from slot ${slotNumber}`);
    // Fetch data from the server, then start the game scene
    this.scene.start("WorldMapScene"); // Example for now
  }

  // Return to main menu option from inside the game
  returnToMainMenu() {
    this.scene.start("GameScene");
  }
}

class WorldMapScene extends Phaser.Scene {
  constructor() {
    super({ key: "WorldMapScene" });
  }

  preload() {
    this.load.image(
      "placeholderWorldMap",
      "src/assets/placeholderWorldMap.png"
    );
    this.load.image(
      "placeholderCharacter",
      "src/assets/techmage.png"
    );
    this.load.image("door", "src/assets/door.png");
  }

  create() {
    const mapImage = this.add.image(400, 300, "placeholderWorldMap");
    mapImage.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    this.add
      .text(400, 50, "Dimension of Magic", { fontSize: "32px", fill: "#fff" })
      .setOrigin(0.5);

    this.createPlayer();

    // Create the door
    this.door = this.add.rectangle(700, 300, 50, 100, 0xff0000).setOrigin(-1.5);
    this.battleZone = this.add
      .zone(500, 300, 100, 100)
      .setOrigin(0)
      .setInteractive();

    this.battleZone.on("pointerdown", () => {
      this.scene.start("BattleScene");
    });

    this.cursors = this.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  createPlayer() {
    this.player = this.physics.add.sprite(400, 300, "placeholderCharacter");
    this.player.setCollideWorldBounds(true);
    const scaleFactor = 0.1; // Adjust size
    this.player.setDisplaySize(
      this.player.width * scaleFactor,
      this.player.height * scaleFactor
    );
  }

  update() {
    this.handlePlayerMovement();
    this.checkDoorInteraction();
  }

  handlePlayerMovement() {
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

  checkDoorInteraction() {
    const doorBounds = this.door.getBounds();
    const playerBounds = this.player.getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(doorBounds, playerBounds)) {
      this.scene.start("Map1Scene");
    }
  }
}

class Map1Scene extends Phaser.Scene {
  constructor() {
    super({ key: "Map1Scene" });
  }

  preload() {
    this.load.image(
      "placeholderMap1Scene",
      "src/assets/placeholderMap1Scene.png"
    );
    this.load.image(
      "placeholderCharacter",
      "src/assets/placeholderCharacter.png"
    );
    this.load.image("door", "src/assets/door.png");
  }

  create() {
    const mapImage = this.add.image(400, 300, "placeholderMap1Scene");
    mapImage.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    this.createPlayer();

    // Create the door
    this.door = this.add.rectangle(700, 300, 50, 100, 0xff0000).setOrigin(-1.5);
    this.battleZone = this.add
      .zone(500, 300, 100, 100)
      .setOrigin(0)
      .setInteractive();

    this.battleZone.on("pointerdown", () => {
      this.scene.start("BattleScene");
    });

    this.cursors = this.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  createPlayer() {
    this.player = this.physics.add.sprite(400, 300, "placeholderCharacter");
    this.player.setCollideWorldBounds(true);
    const scaleFactor = 0.1; // Adjust size
    this.player.setDisplaySize(
      this.player.width * scaleFactor,
      this.player.height * scaleFactor
    );
  }

  update() {
    this.handlePlayerMovement();
    this.checkDoorInteraction();
  }

  handlePlayerMovement() {
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

  checkDoorInteraction() {
    const doorBounds = this.door.getBounds();
    const playerBounds = this.player.getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(doorBounds, playerBounds)) {
      this.scene.start("Map2Scene");
    }
  }
}

class Map2Scene extends Phaser.Scene {
  constructor() {
    super({ key: "Map2Scene" });
  }

  preload() {
    this.load.image(
      "placeholderMap2Scene",
      "src/assets/placeholderMap2Scene.png"
    );
    this.load.image(
      "placeholderCharacter",
      "src/assets/placeholderCharacter.png"
    );
    this.load.image("door", "src/assets/door.png");
  }

  create() {
    const mapImage = this.add.image(400, 300, "placeholderMap2Scene");
    mapImage.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    this.createPlayer();

    // Create the door
    this.door = this.add.rectangle(700, 300, 50, 100, 0xff0000).setOrigin(-1.5);
    this.battleZone = this.add
      .zone(500, 300, 100, 100)
      .setOrigin(0)
      .setInteractive();

    this.battleZone.on("pointerdown", () => {
      this.scene.start("BattleScene");
    });

    this.cursors = this.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  createPlayer() {
    this.player = this.physics.add.sprite(400, 300, "placeholderCharacter");
    this.player.setCollideWorldBounds(true);
    const scaleFactor = 0.1; // Adjust size
    this.player.setDisplaySize(
      this.player.width * scaleFactor,
      this.player.height * scaleFactor
    );
  }

  update() {
    this.handlePlayerMovement();
    this.checkDoorInteraction();
  }

  handlePlayerMovement() {
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

  checkDoorInteraction() {
    const doorBounds = this.door.getBounds();
    const playerBounds = this.player.getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(doorBounds, playerBounds)) {
      this.scene.start("Map3Scene");
    }
  }
}

class Map3Scene extends Phaser.Scene {
  constructor() {
    super({ key: "Map3Scene" });
  }

  preload() {
    this.load.image(
      "placeholderMap3Scene",
      "src/assets/placeholderMap3Scene.png"
    );
    this.load.image(
      "placeholderCharacter",
      "src/assets/placeholderCharacter.png"
    );
    this.load.image("door", "src/assets/door.png");
  }

  create() {
    const mapImage = this.add.image(400, 300, "placeholderMap3Scene");
    mapImage.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    this.createPlayer();

    // Create the door
    this.door = this.add.rectangle(700, 300, 50, 100, 0xff0000).setOrigin(-1.5);
    this.battleZone = this.add
      .zone(500, 300, 100, 100)
      .setOrigin(0)
      .setInteractive();

    this.battleZone.on("pointerdown", () => {
      this.scene.start("BattleScene");
    });

    this.cursors = this.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  createPlayer() {
    this.player = this.physics.add.sprite(400, 300, "placeholderCharacter");
    this.player.setCollideWorldBounds(true);
    const scaleFactor = 0.1; // Adjust size
    this.player.setDisplaySize(
      this.player.width * scaleFactor,
      this.player.height * scaleFactor
    );
  }

  update() {
    this.handlePlayerMovement();
    this.checkDoorInteraction();
  }

  handlePlayerMovement() {
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

  checkDoorInteraction() {
    const doorBounds = this.door.getBounds();
    const playerBounds = this.player.getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(doorBounds, playerBounds)) {
      this.scene.start("WorldMapScene");
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

export { GameScene, WorldMapScene, BattleScene, Map1Scene, Map2Scene, Map3Scene };
export default GameScene;