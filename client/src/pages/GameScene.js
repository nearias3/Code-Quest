import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    // Load assets (sprites, images, etc.)
  }
  
  create() {
    this.add
      .text(400, 100, "Wizards Apprentice: Pieces of the Master", {
        fontSize: "28px",
        fill: "#fff",
      })
      .setOrigin(0.5);

    // Menu options
    this.menuOptions = [
      { text: "New Game", action: () => this.startNewGame() },
      { text: "Load Game", action: this.loadGame.bind(this) },
      { text: "Login", action: this.login.bind(this) },
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
      text.on("pointerdown", () => {
        option.action(); // Call the associated action
      });

      return text;
    });

    // Add full-screen button
    this.fullscreenButton = this.add
      .text(750, 550, "[ ]", { fontSize: "24px", fill: "#fff" }) // Use brackets for the button
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

  startNewGame() {
    this.scene.start("WorldMapScene"); // Change to your desired game start
  }

  loadGame() {
    console.log("Load Game clicked!");
    // Implement load game functionality
  }

  login() {
    console.log("Login clicked!");
    // Implement login functionality
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

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [GameScene, WorldMapScene, BattleScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};

const Game = new Phaser.Game(config);
export default Game;
export { GameScene };