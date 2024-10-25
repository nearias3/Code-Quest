import Phaser from "phaser";
import GameHelpers from "../utils/GameHelpers";

class TutorialScene extends Phaser.Scene {
  constructor() {
    super({ key: "TutorialScene" });
    this.isPaused = false;
  }

  preload() {
    this.load.image(
      "room1",
      "../../public/assets/images/worldbuilding/room1-600x400.png"
    );
    this.load.image(
      "room2",
      "../../public/assets/images/worldbuilding/room2-x200.png"
    );
    this.load.image(
      "wall-hori",
      "../../public/assets/images/worldbuilding/hori-wall-400x32.png"
    );
    this.load.image(
      "wall-vert",
      "../../public/assets/images/worldbuilding/vert-wall-32x400.png"
    );
    this.load.image(
      "floor-button",
      "../../public/assets/images/worldbuilding/floor-button.png"
    );
    this.load.image(
      "door",
      "../../public/assets/images/worldbuilding/door.png"
    );
    this.load.image(
      "apprentice",
      "../../public/assets/images/worldbuilding/apprentice-01.png"
    );
  }

  create() {
    // var player;
    // var walls;
    // var buttons;
    // var doors;
    // var cursors;

    this.add.image(400, 400, "room1");
    this.add.image(400, 108, "room2");

    this.walls = this.physics.add.staticGroup();

    this.walls.create(260, 450, "wall-hori").setScale(0.5).refreshBody();
    this.walls.create(360, 493, "wall-vert").setScale(0.5).refreshBody();
    this.walls.create(290, 290, "wall-vert").setScale(0.5).refreshBody();
    this.walls.create(487, 443, "wall-vert").setScale(0.5).refreshBody();
    this.walls.create(593, 450, "wall-hori").setScale(0.5).refreshBody();
    this.walls.create(543, 350, "wall-hori").setScale(0.5).refreshBody();
    this.walls.create(600, 600, "wall-hori").setScale(0.5).refreshBody();
    this.walls.create(400, 600, "wall-hori").setScale(0.5).refreshBody();
    this.walls.create(200, 600, "wall-hori").setScale(0.5).refreshBody();
    this.walls.create(100, 500, "wall-vert").setScale(0.5).refreshBody();
    this.walls.create(100, 300, "wall-vert").setScale(0.5).refreshBody();
    this.walls.create(600, 200, "wall-hori").setScale(0.5).refreshBody();
    this.walls.create(400, 10, "wall-hori").setScale(0.5).refreshBody();
    this.walls.create(200, 200, "wall-hori").setScale(0.5).refreshBody();
    this.walls.create(700, 500, "wall-vert").setScale(0.5).refreshBody();
    this.walls.create(700, 300, "wall-vert").setScale(0.5).refreshBody();
    this.walls.create(500, 105, "wall-vert").setScale(0.5).refreshBody();
    this.walls.create(300, 105, "wall-vert").setScale(0.5).refreshBody();
    this.walls.create(520, 200, "wall-hori").setScale(0.5).refreshBody();
    this.walls.create(280, 200, "wall-hori").setScale(0.5).refreshBody();

    // this.buttons = this.physics.add.group({
    //   key: "floor-button"
    // });

    this.buttons = this.physics.add.group();

    this.buttons.create(200, 250, "floor-button");
    this.buttons.create(300, 525, "floor-button");
    this.buttons.create(590, 500, "floor-button");
    this.buttons.create(570, 400, "floor-button");

    this.doors = this.physics.add.staticGroup();
    this.doors.create(400, 200, "door");

    this.door = this.add.rectangle(335, 137, 32, 32, 0xff0000).setOrigin(-1.5);

    GameHelpers.createPlayer(this);

    this.player.body.onOverlap = true;

    this.player.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // function toggleButton(button) {
    //   button.setScale(0.8);

    // }

    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.buttons, this.walls);

    this.physics.add.overlap(this.player, this.buttons);

    this.physics.world.on("overlap", (gameObj1, gameObj2, body1, body2) => {
      gameObj2.setScale(0.8);
    });

    this.physics.world.off("overlap", (gameObj1, gameObj2, body1, body2) => {
      gameObj1.setScale(1.2);
      console.log("wut");
    });

    GameHelpers.createPauseMenu(this);

    this.input.keyboard.on("keydown-ENTER", () => {
      GameHelpers.togglePauseMenu(this);
    });
  }

  update() {
    GameHelpers.handlePlayerMovement(this, this.cursors, this.player);
    GameHelpers.checkDoorInteraction(this, this.player, this.door, 'BattleScene');
  }
}

export default TutorialScene;
