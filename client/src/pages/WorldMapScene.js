import Phaser from "phaser";
import GameHelpers from "../utils/GameHelpers";

class WorldMapScene extends Phaser.Scene {
  constructor() {
    super({ key: "WorldMapScene" });
    this.isPaused = false;
  }

  preload() {
    this.load.image(
      "placeholderWorldMap",
      "/assets/placeholderWorldMap.png"
    );
    this.load.image("door", "/assets/door.png");
    this.load.image(
          "placeholderCharacter",
          "/assets/placeholderCharacter.png"
        );

  }

  create(data) {
    // Attach the login and signup methods if they are passed
    this.showLoginForm = data.showLoginForm;
    this.showSignupForm = data.showSignupForm;

    
    const mapImage = this.add.image(400, 300, "placeholderWorldMap");
    mapImage.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    this.add
      .text(400, 50, "Dimension of Magic", { fontSize: "32px", fill: "#fff" })
      .setOrigin(0.5);

    GameHelpers.createPlayer(this);

    this.door = this.add.rectangle(700, 300, 50, 100, 0xff0000).setOrigin(-1.5);

    this.battleZone = this.add.zone(500, 300, 100, 100).setInteractive();
    this.battleZone.on("pointerdown", () => {
      this.scene.start("BattleScene");
    });

    this.cursors = this.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    });
    // Set up the pause menu using GameHelpers
    GameHelpers.createPauseMenu(this);

    // Listen for the "Enter" key to toggle pause
    this.input.keyboard.on("keydown-ENTER", () => {
      GameHelpers.togglePauseMenu(this);
    });
  }


  update() {
    GameHelpers.handlePlayerMovement(this, this.cursors, this.player);
    GameHelpers.checkDoorInteraction(this, this.player, this.door, 'BattleScene');
  }
}

export default WorldMapScene;
