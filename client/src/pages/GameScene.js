import Phaser from "phaser";
import GameHelpers from "../utils/GameHelpers";
import { loginUser, signupUser } from "../utils/authService";

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.isLoggedIn = false;
    this.isGameInProgress = false; // Track if the game is in progress
    this.form = null; // Initialize form as null
  }

  preload() {
    GameHelpers.preloadSharedAssets(this);
    // Load assets (sprites, images, etc.)
    console.log("GameScene: preload");
  }

  create() {
    // Pass reference of `checkLoginStatus` to be used elsewhere
    this.checkLoginStatus = this.checkLoginStatus.bind(this);
    
    // Check if user is logged in via token
    this.checkLoginStatus();

    // Set up the menu using the helper
    GameHelpers.displayMainMenu(this, [
      { text: "New Game", action: this.startNewGame.bind(this) },
      { text: "Settings", action: this.openSettings.bind(this) },
    ]);
    console.log("GameScene: create");
  }

  checkLoginStatus() {
    const token = localStorage.getItem("token");
    this.isLoggedIn = !!token;
  }

  
  // Shared form handling (login, sign up, save game, load game)
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
  

  // Return to main menu option from inside the game
  returnToMainMenu() {
    this.scene.start("GameScene");
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

  async saveGame() {
    console.log("Save Game clicked!");

    // Clear current menu items
    this.children.removeAll();

    // Display save slot options
    this.add
      .text(400, 100, "Choose a Save Slot:", { fontSize: "28px", fill: "#fff" })
      .setOrigin(0.5);

    // Create save slot buttons
    const saveSlots = [1, 2, 3];
    saveSlots.forEach((slot, index) => {
      const text = this.add
        .text(400, 200 + index * 50, `Save Slot ${slot}`, {
          fontSize: "24px",
          fill: "#fff",
        })
        .setOrigin(0.5)
        .setInteractive();

      // When the slot is clicked, trigger the actual save function
      text.on("pointerover", () => text.setFill("#ff0"));
      text.on("pointerout", () => text.setFill("#fff"));
      text.on("pointerdown", () => this.performSave(slot)); // Save to the selected slot
    });
  }
  

  // Perform save in the selected slot
  async performSave(slotNumber) {
    console.log(`Saving game to slot ${slotNumber}...`);

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
      const response = await fetch("http://localhost:4000/api/save-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          slotNumber,
          playerStats,
          progress,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Game saved successfully to slot ${slotNumber}:", result);
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

    // After saving (or failing), show the "Back to Menu" button
    const backButton = this.add
      .text(400, 450, "Back to Menu", {
        fontSize: "24px",
        fill: "#fff",
      })
      .setOrigin(0.5)
      .setInteractive();

    backButton.on("pointerover", () => backButton.setFill("#ff0"));
    backButton.on("pointerout", () => backButton.setFill("#fff"));
    backButton.on("pointerdown", () => {
      GameHelpers.displayMainMenu(this); // Go back to the main menu
    });
  }

  // Load game slots
  showLoadSlots() {
    this.children.removeAll(); // Clear menu items

    // Display load slot options
    this.add
      .text(400, 100, "Choose a Load Slot:", {
        fontSize: "28px",
        fill: "#fff",
      })
      .setOrigin(0.5);

    // Create load slot buttons
    const loadSlots = [1, 2, 3];
    loadSlots.forEach((slot, index) => {
      const text = this.add
        .text(400, 300 + index * 50, `Load Slot ${slot}`, { fill: "#fff" })
        .setOrigin(0.5)
        .setInteractive();

      // When the slot is clicked, trigger the actual load function
      text.on("pointerover", () => text.setFill("#ff0"));
      text.on("pointerout", () => text.setFill("#fff"));
      text.on("pointerdown", () => this.loadGame(slot));
    });
  }

  // Load game method
  loadGame(slotNumber) {
    console.log(`Load game from slot ${slotNumber}`);
    // Fetch data from the server, then start the game scene
    this.scene.start("WorldMapScene"); // Example for now
  }

  openSettings() {
    console.log("Settings clicked!");
    // Any settings functionalities should be implemented here!!
  }

  handlePlayerMovement(cursors, player) {
    if (cursors.a.isDown) {
      player.setVelocityX(-160);
    } else if (cursors.d.isDown) {
      player.setVelocityX(160);
    } else {
      player.setVelocityX(0);
    }

    if (cursors.w.isDown) {
      player.setVelocityY(-160);
    } else if (cursors.s.isDown) {
      player.setVelocityY(160);
    } else {
      player.setVelocityY(0);
    }
  }
}

export default GameScene;
  