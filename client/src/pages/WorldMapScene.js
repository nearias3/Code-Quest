import Phaser from "phaser";
import GameHelpers from "../utils/GameHelpers";

class WorldMapScene extends Phaser.Scene {
  constructor() {
    super({ key: "WorldMapScene" });
    this.isPaused = false;
  }

  preload() {
    this.load.image("02", "/assets/images/worldbuilding/tilesets/02.png");
    this.load.image("16", "/assets/images/worldbuilding/tilesets/16.png");
    this.load.image("17", "/assets/images/worldbuilding/tilesets/17.png");
    this.load.image(
      "Bridge_All",
      "/assets/images/worldbuilding/tilesets/Bridge_All.png"
    );
    this.load.image(
      "Castle_Purple",
      "/assets/images/worldbuilding/tilesets/Castle_Purple.png"
    );
    this.load.image(
      "Goblin_House",
      "/assets/images/worldbuilding/tilesets/Goblin_House.png"
    );
    this.load.image(
      "HappySheep_All",
      "/assets/images/worldbuilding/tilesets/HappySheep_All.png"
    );
    this.load.image(
      "Rocks_04",
      "/assets/images/worldbuilding/tilesets/Rocks_04.png"
    );
    this.load.image(
      "Tilemap_Elevation",
      "/assets/images/worldbuilding/tilesets/Tilemap_Elevation.png"
    );
    this.load.image(
      "Tilemap_Flat",
      "/assets/images/worldbuilding/tilesets/Tilemap_Flat.png"
    );
    this.load.image("Tree", "/assets/images/worldbuilding/tilesets/Tree.png");
    this.load.image(
      "W_Idle",
      "/assets/images/worldbuilding/tilesets/W_Idle.png"
    );
    this.load.image("Water", "/assets/images/worldbuilding/tilesets/Water.png");
    this.load.tilemapTiledJSON(
      "WorldMapSceneIsland",
      "/assets/images/worldbuilding/WorldMapSceneIsland.json"
    );
    this.load.image("placeholderCharacter", "/assets/placeholderCharacter.png");
  }

  create(data) {
    // Attach the load and save methods if they are passed
    if (data.showLoadSlots && data.showSaveSlots) {
      console.log("Received save/load functions in WorldMapScene");
      this.showLoadSlots = data.showLoadSlots;
      this.showSaveSlots = data.showSaveSlots;
      console.log("Attached showLoadSlots and showSaveSlots");
    } else {
      console.error("Load and Save slots not passed correctly.");
    }

    this.add.image(0, 0, "02");
    this.add.image(0, 0, "16");
    this.add.image(0, 0, "17");
    this.add.image(0, 0, "Bridge_All");
    this.add.image(0, 0, "Castle_Purple");
    this.add.image(0, 0, "Gobline_House");
    this.add.image(0, 0, "HappySheep_All");
    this.add.image(0, 0, "Rocks_04");
    this.add.image(0, 0, "Tilemap_Elevation");
    this.add.image(0, 0, "Tilemap_Flat");
    this.add.image(0, 0, "Tree");
    this.add.image(0, 0, "W_Idle");
    this.add.image(0, 0, "Water");

    const map = this.make.tilemap({ key: "WorldMapSceneIsland" });

    // Add all the tilesets
    const tileset1 = map.addTilesetImage("02", "02");
    const tileset2 = map.addTilesetImage("16", "16");
    const tileset3 = map.addTilesetImage("17", "17");
    const tileset4 = map.addTilesetImage("Bridge_All", "Bridge_All");
    const tileset5 = map.addTilesetImage("Castle_Purple", "Castle_Purple");
    const tileset6 = map.addTilesetImage("Goblin_House", "Goblin_House");
    const tileset7 = map.addTilesetImage("HappySheep_All", "HappySheep_All");
    const tileset8 = map.addTilesetImage("Rocks_04", "Rocks_04");
    const tileset9 = map.addTilesetImage(
      "Tilemap_Elevation",
      "Tilemap_Elevation"
    );
    const tileset10 = map.addTilesetImage("Tilemap_Flat", "Tilemap_Flat");
    const tileset11 = map.addTilesetImage("Tree", "Tree");
    const tileset12 = map.addTilesetImage("W_Idle", "W_Idle");
    const tileset13 = map.addTilesetImage("Water", "Water");

    // Create layers
    map.createLayer("Water", tileset13);
    map.createLayer("Sand", tileset10);
    map.createLayer("ElevatedTerrain", tileset9);
    map.createLayer("Grass", tileset10);
    map.createLayer("Bridges", tileset4);
    map.createLayer("Castle", tileset5);
    map.createLayer("Building", tileset6);
    map.createLayer("Trees", tileset11);
    map.createLayer("WaterRocks", tileset8);
    map.createLayer("SkullSign", tileset2);
    map.createLayer("ArrowSign", tileset3);
    map.createLayer("Sheep", tileset7);
    map.createLayer("Mushrooms", tileset1);
    map.createLayer("Wood", tileset12);

    this.add
      .text(400, 50, "Dimension of Magic", { fontSize: "32px", fill: "#fff" })
      .setOrigin(0.5);

    GameHelpers.createPlayer(this);

    this.door = this.add.rectangle(700, 300, 50, 100, 0xff0000).setOrigin(-1.5);

    this.battleZone = this.add.zone(500, 300, 100, 100).setInteractive();
    this.battleZone.on("pointerdown", () => {
      this.scene.start("BattleScene", {
        showLoadSlots: this.showLoadSlots.bind(this),
        showSaveSlots: this.saveGame.bind(this),
      });
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

    // Camera that follows the player
    const width = map.widthInPixels;
    const height = map.heightInPixels;

    this.cameras.main.setBounds(0, 0, width, height); // Set the camera bounds
    this.cameras.main.startFollow(this.player); // Camera follows the player
  }

  update() {
    GameHelpers.handlePlayerMovement(this, this.cursors, this.player);
    GameHelpers.checkDoorInteraction(
      this,
      this.player,
      this.door,
      "BattleScene"
    );
  }
}

export default WorldMapScene;