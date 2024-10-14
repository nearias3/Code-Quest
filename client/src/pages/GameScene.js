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