import Phaser from "phaser";
import GameHelpers from "../utils/GameHelpers";
import { loginUser, signupUser } from "../utils/authService";

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.isLoggedIn = false;
    this.isGameInProgress = false; // Track if the game is in progress
    this.form = null; // Initialize form as null

    // Bind the login and signup methods to this scene instance
    this.showLoginForm = this.showLoginForm.bind(this);
    this.showSignupForm = this.showSignupForm.bind(this);
  }

  preload() {
    GameHelpers.preloadSharedAssets(this);
    // Load assets (sprites, images, etc.)
  }

  create() {
    // Check if user is logged in via token
    this.checkLoginStatus();

    // Set up the menu using the helper
    GameHelpers.displayMainMenu(this);
  }

  checkLoginStatus() {
    const token = localStorage.getItem("token");
    this.isLoggedIn = !!token;
  }

  // Shared form handling (login, sign up, save game, load game)
  showLoginForm() {
    // Clear the current menu content
    this.children.removeAll();

    // Disable keyboard input (stops movement keys like WASD)
    this.input.keyboard.enabled = false;

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

      if (response && response.login && response.login.token) {
        localStorage.setItem("token", response.login.token);
        this.isLoggedIn = true; // Mark the user as logged in

        // Remove the form
        this.form.destroy();

        // Re-enable keyboard input after the form is removed
        this.input.keyboard.enabled = true;

        GameHelpers.displayMainMenu(this); // Go back to the main menu
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

    // Disable keyboard input (stops movement keys like WASD)
    this.input.keyboard.enabled = false;

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

      if (response && response.token) {
        localStorage.setItem("token", response.token);
        this.isLoggedIn = true; // User is now signed up and logged in

        // Remove the form
        this.form.destroy();

        // Re-enable keyboard input after the form is removed
        this.input.keyboard.enabled = true;

        GameHelpers.displayMainMenu(this); // Return to main menu
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
    GameHelpers.displayMainMenu(this); // Refresh the menu after logging out
  }

  // New Game logic
  startNewGame() {
    this.scene.start("TutorialScene", {
      showLoadSlots: this.showLoadSlots.bind(this),
      showSaveSlots: this.saveGame.bind(this),
    });
  }

  async saveGame() {

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
  async performSave(scene, slotNumber) {

    try {
      const response = await fetch("http://localhost:4000/api/save-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          slotNumber,
          scene
        }),
      });

      const result = await response.json();

      if (response.ok) {
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
    this.scene.start("WorldMapScene", {
      showLoadSlots: this.showLoadSlots.bind(this),
      showSaveSlots: this.saveGame.bind(this),
    }); // Example for now
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
  