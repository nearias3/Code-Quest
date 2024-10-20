import Phaser from "phaser";

const GameHelpers = {
  preloadSharedAssets(scene) {
    // Load shared assets
    console.log(scene);
  },

  createPlayer(scene) {
    scene.player = scene.physics.add.sprite(400, 300, "placeholderCharacter");
    scene.player.setCollideWorldBounds(true);
    const scaleFactor = 0.1;
    scene.player.setDisplaySize(
      scene.player.width * scaleFactor,
      scene.player.height * scaleFactor
    );
  },

  handlePlayerMovement(scene, cursors, player) {
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
  },

  checkDoorInteraction(scene, player, door, targetScene) {
    const doorBounds = door.getBounds();
    const playerBounds = player.getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(doorBounds, playerBounds)) {
      scene.scene.start(targetScene);
    }
  },

  displayMainMenu(scene) {
    scene.checkLoginStatus();
    scene.children.removeAll(); // Clear menu items

    scene.add
      .text(400, 100, "Wizard's Apprentice: Pieces of the Master", {
        fontSize: "28px",
        fill: "#fff",
      })
      .setOrigin(0.5);

    // Menu options, show New Game and Settings regardless of if LoggedIn or not
    const menuOptions = [
      {
        text: "New Game",
        action: scene.startNewGame.bind(scene),
      },
      {
        text: scene.isLoggedIn ? "Load Game" : "Login",
        action: scene.isLoggedIn
          ? scene.showLoadSlots.bind(scene)
          : scene.showLoginForm.bind(scene),
      },
    ];

    // Add "Save Game" option if the user is logged in
    if (scene.isLoggedIn) {
      menuOptions.push({
        text: "Save Game",
        action: scene.saveGame.bind(scene),
      });

      menuOptions.push({
        text: "Settings",
        action: scene.openSettings.bind(scene),
      });
      menuOptions.push({
        text: "Logout",
        action: scene.logout.bind(scene),
      });
    } else {
      // If not logged in, add "Sign Up" option
      menuOptions.push({
        text: "Settings",
        action: scene.openSettings.bind(scene),
      });
      menuOptions.push({
        text: "Sign Up",
        action: scene.showSignupForm.bind(scene),
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
    scene.children.removeAll(); // Clear menu items

    // Display save slot options
    scene.add
      .text(400, 100, "Choose a Save Slot:", { fontSize: "28px", fill: "#fff" })
      .setOrigin(0.5);

    const saveSlots = [1, 2, 3];
    saveSlots.forEach((slot, index) => {
      const text = scene.add
        .text(400, 200 + index * 50, `Save Slot ${slot}`, {
          fontSize: "24px",
          fill: "#fff",
        })
        .setOrigin(0.5)
        .setInteractive();

      // When the slot is clicked, trigger the actual save function
      text.on("pointerover", () => text.setFill("#ff0"));
      text.on("pointerout", () => text.setFill("#fff"));
      text.on("pointerdown", () => this.performSave(scene, slot)); // Save to the selected slot
    });
  },

  // Save game data to a selected slot
  async performSave(scene, slotNumber) {
    console.log(`Saving game to slot ${slotNumber}...`);

    // Mockup: Replace this with actual game data (e.g., player stats, progress)
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
        console.log(`Game saved successfully to slot ${slotNumber}:`, result);
        scene.add
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
    console.log(`Loading game from slot ${slotNumber}...`);

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
        console.log(`Game loaded from slot ${slotNumber}:`, result);

        // Load the player's progress and start the game scene
        scene.scene.start("WorldMapScene", {
          playerStats: result.playerStats,
          progress: result.progress,
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

      const settingsText = scene.add
        .text(0, 40, "Settings", { fontSize: "24px", fill: "#fff" })
        .setOrigin(0.5)
        .setInteractive();

      additionalOptions = [loadText, saveText, settingsText];

      // Add interactivity for load and save game
      loadText.on("pointerdown", () => scene.showLoadSlots(scene));
      saveText.on("pointerdown", () => scene.showSaveSlots(scene));
      settingsText.on("pointerdown", () => scene.openSettings(scene));
    } else {
      // Not logged-in users get Login and Signup options
      const loginText = scene.add
        .text(0, -40, "Login", { fontSize: "24px", fill: "#fff" })
        .setOrigin(0.5)
        .setInteractive();

      const signupText = scene.add
        .text(0, 0, "Sign Up", { fontSize: "24px", fill: "#fff" })
        .setOrigin(0.5)
        .setInteractive();

      additionalOptions = [loginText, signupText];

      // Add interactivity for login and signup
      loginText.on("pointerdown", () => scene.showLoginForm());
      signupText.on("pointerdown", () => scene.showSignupForm());
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

  openSettings(scene) {
    // You could add your settings logic here, e.g., adjusting volume, controls, etc.
    console.log(scene);
  },
};

export default GameHelpers;
