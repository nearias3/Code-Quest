import Phaser from "phaser";

const GameHelpers = {
  // Global state variable for player position
  playerPosition: { x: 400, y: 300 },

  preloadSharedAssets() {
  },

  createPlayer(scene) {
    scene.player = scene.physics.add.sprite(
      this.playerPosition.x,
      this.playerPosition.y,
      "apprentice"
    );
    scene.player.setCollideWorldBounds(true);
  },

  handlePlayerMovement(scene, cursors, player) {
    let moving = false;

    if (cursors.a.isDown) {
      player.setFlipX(false);
      player.setVelocityX(-160);
      moving = true;
    } else if (cursors.d.isDown) {
      player.setFlipX(true);
      player.setVelocityX(160);
      moving = true;
    } else {
      player.setVelocityX(0);
    }

    if (cursors.w.isDown) {
      player.setVelocityY(-160);
      moving = true;
    } else if (cursors.s.isDown) {
      player.setVelocityY(160);
      moving = true;
    } else {
      player.setVelocityY(0);
    }

    if (moving) {
      player.anims.play("walk", true);
    } else {
      player.anims.play("idle", true);
    }

    // Update global player position
    this.playerPosition.x = player.x;
    this.playerPosition.y = player.y;
  },

  checkDoorInteraction(scene, player, door, targetScene) {
    const doorBounds = door.getBounds();
    const playerBounds = player.getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(doorBounds, playerBounds)) {
      scene.scene.start(targetScene);
    }
  },

  displayMainMenu(scene) {

    if (typeof scene.showLoginForm !== "function") {
      console.error("showLoginForm is not defined on this scene");
    }

    if (scene.checkLoginStatus) {
      scene.checkLoginStatus();
    }

    scene.children.removeAll(); // Clear menu items

    scene.add
      .text(400, 100, "Wizard's Apprentice: Pieces of the Master", {
        fontSize: "28px",
        fill: "#fff",
      })
      .setOrigin(0.5);

    // Menu options, show New Game regardless of if LoggedIn or not
    const menuOptions = [
      {
        text: scene.isLoggedIn ? "New Game" : "Login",
        action: scene.isLoggedIn
          ? scene.startNewGame.bind(scene)
          : scene.showLoginForm
          ? scene.showLoginForm.bind(scene)
          : () => console.error("showLoginForm is not defined on this scene"),
      },
    ];

    // Add "Save Game" option if the user is logged in
    if (scene.isLoggedIn) {
      menuOptions.push({
        text: "Load Game",
        action: scene.showLoadSlots.bind(scene),
      });
      menuOptions.push({
        text: "Save Game",
        action: scene.saveGame.bind(scene),
      });

      menuOptions.push({
        text: "Logout",
        action: scene.logout.bind(scene),
      });
    } else {
      // If not logged in, add "Sign Up" option

      menuOptions.push({
        text: "Sign Up",
        action: scene.showSignupForm
          ? scene.showSignupForm.bind(scene)
          : () => console.error("showSignupForm is not defined on this scene"),
      });
    }

    // Create interactive menu items
    menuOptions.forEach((option, index) => {
      const text = scene.add
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
  },

  // Display the save slots menu
  showSaveSlots(scene) {
    scene.pauseMenu.setVisible(false); // Hide the pause menu

    // Add a background for the save slots menu
    const saveBg = scene.add
      .rectangle(400, 300, 600, 400, 0x000000, 0.7) // Semi-transparent black background
      .setOrigin(0.5);

    // Display save slot options
    const saveText = scene.add
      .text(400, 100, "Choose a Save Slot:", { fontSize: "28px", fill: "#fff" })
      .setOrigin(0.5);

    const saveSlots = [1, 2, 3];
    const saveSlotTexts = [];

    saveSlots.forEach((slot, index) => {
      const text = scene.add
        .text(400, 200 + index * 50, `Save Slot ${slot}`, {
          fontSize: "24px",
          fill: "#fff",
        })
        .setOrigin(0.5)
        .setInteractive();

      // Save to the selected slot
      text.on("pointerdown", () => this.performSave(scene, slot));
      saveSlotTexts.push(text); // Track save slot texts for later removal
    });

    // Add the "Back" button to return to the menu after saving
    const backButton = scene.add
      .text(400, 400, "Back to Menu", {
        fontSize: "24px",
        fill: "#fff",
      })
      .setOrigin(0.5)
      .setInteractive();

    backButton.on("pointerover", () => backButton.setFill("#ff0"));
    backButton.on("pointerout", () => backButton.setFill("#fff"));

    // When the back button is clicked, return to the pause menu
    backButton.on("pointerdown", () => {
      // Destroy save menu elements
      saveBg.destroy(); // Remove background
      saveText.destroy(); // Remove "Choose a Save Slot" title
      saveSlotTexts.forEach((text) => text.destroy()); // Remove save slot options
      backButton.destroy(); // Remove back button
      scene.pauseMenu.setVisible(true); // Show the original pause menu
    });
  },

  // Save game data to a selected slot
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
        const savedText = scene.add
          .text(400, 350, "Game Saved!", {
            fontSize: "18px",
            fill: "#00ff00",
          })
          .setOrigin(0.5);

        // Set a timer to remove the "Game Saved!" text after 3 seconds
        scene.time.delayedCall(3000, () => {
          savedText.destroy();
        });
      } else {
        throw new Error(result.message || "Failed to save game.");
      }
    } catch (error) {
      console.error("Save Game failed:", error);
      scene.add
        .text(400, 400, "Failed to Save Game", {
          fontSize: "18px",
          fill: "#ff0000",
        })
        .setOrigin(0.5);
    }
  },

  // Display the load slots menu
  showLoadSlots(scene) {
    scene.children.removeAll(); // Clear menu items

    // Display load slot options
    scene.add
      .text(400, 100, "Choose a Load Slot:", { fontSize: "28px", fill: "#fff" })
      .setOrigin(0.5);

    const loadSlots = [1, 2, 3];
    loadSlots.forEach((slot, index) => {
      const text = scene.add
        .text(400, 300 + index * 50, `Load Slot ${slot}`, { fill: "#fff" })
        .setOrigin(0.5)
        .setInteractive();

      // When the slot is clicked, trigger the actual load function
      text.on("pointerover", () => text.setFill("#ff0"));
      text.on("pointerout", () => text.setFill("#fff"));
      text.on("pointerdown", () => this.loadGame(scene, slot)); // Load the selected slot
    });
  },

  // Load game data from the selected slot
  async loadGame(scene, slotNumber) {
    try {
      const response = await fetch(
        `http://localhost:4000/api/load-game/${slotNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        // Load the player's progress and start the game scene
        scene.scene.start("WorldMapScene", {
          playerStats: result.playerStats,
          progress: result.progress,
          scene: result.scene,
        });
      } else {
        throw new Error(result.message || "Failed to load game.");
      }
    } catch (error) {
      console.error("Load Game failed:", error);
      scene.add
        .text(400, 400, "Failed to Load Game", {
          fontSize: "18px",
          fill: "#ff0000",
        })
        .setOrigin(0.5);
    }
  },

  createPauseMenu(scene) {
    // Clear the existing pause menu (if any)
    if (scene.pauseMenu) {
      scene.pauseMenu.destroy();
    }

    scene.pauseMenu = scene.add.container(400, 300).setVisible(false);
    const pauseBg = scene.add
      .rectangle(0, 0, 300, 200, 0x000000)
      .setOrigin(0.5)
      .setAlpha(0.8);

    const resumeText = scene.add
      .text(0, -80, "Resume Game", { fontSize: "24px", fill: "#fff" })
      .setOrigin(0.5)
      .setInteractive();

    // Add interactive elements for logged-in or not logged-in users
    let additionalOptions = [];

    if (localStorage.getItem("token")) {
      // Logged-in users get Load, Save, and Quit options
      const loadText = scene.add
        .text(0, -40, "Load Game", { fontSize: "24px", fill: "#fff" })
        .setOrigin(0.5)
        .setInteractive();

      const saveText = scene.add
        .text(0, 0, "Save Game", { fontSize: "24px", fill: "#fff" })
        .setOrigin(0.5)
        .setInteractive();

      additionalOptions = [loadText, saveText];

      // Add interactivity for load and save game
      loadText.on("pointerdown", () => {
        if (typeof scene.showLoadSlots === "function") {
          GameHelpers.showLoadSlots(scene);
        } else {
          console.error("showLoadSlots is not defined on this scene.");
        }
      });

      saveText.on("pointerdown", () => {
        if (typeof scene.showSaveSlots === "function") {
          GameHelpers.showSaveSlots(scene);
        } else {
          console.error("showSaveSlots is not defined on this scene.");
        }
      });
    }

    // Quit Game (this option is for both logged-in and not-logged-in users)
    const quitText = scene.add
      .text(0, 80, "Quit Game", { fontSize: "24px", fill: "#fff" })
      .setOrigin(0.5)
      .setInteractive();

    // Add interactivity for quit and resume
    resumeText.on("pointerdown", () => this.resumeGame(scene));
    quitText.on("pointerdown", () => scene.scene.start("GameScene"));

    scene.pauseMenu.add([pauseBg, resumeText, quitText, ...additionalOptions]);
  },

  // Toggle Pause Menu
  togglePauseMenu(scene) {
    if (scene.isPaused) {
      this.resumeGame(scene);
    } else {
      this.pauseGame(scene);
    }
  },

  // Display the pause menu
  pauseGame(scene) {
    scene.isPaused = true;
    scene.physics.pause(); // Pause physics
    scene.pauseMenu.setVisible(true); // Show pause menu
    if (scene.player) {
      scene.player.setVelocity(0); // Stop player movement
    }
  },

  // Remove the pause menu and resume gameplay
  resumeGame(scene) {
    scene.isPaused = false;
    scene.physics.resume(); // Resume physics
    scene.pauseMenu.setVisible(false); // Hide pause menu
  },
};

export default GameHelpers;
