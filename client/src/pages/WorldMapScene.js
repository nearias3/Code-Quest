import Phaser from "phaser";
import GameHelpers from "../utils/GameHelpers";

class WorldMapScene extends Phaser.Scene {
  constructor() {
    super({ key: "WorldMapScene" });
    this.isPaused = false;
  }

  preload() {
    this.load.image(
      "WorldMapSceneIsland",
      "/assets/images/worldbuilding/WorldMapSceneIsland.png"
    );  
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

    this.add.image(0, 0, "WorldMapSceneIsland");
    const map = this.make.tilemap({ key: "WorldMapSceneIsland" });

    // Add all the tilesets
    const tileset1 = map.addTilesetImage("02", "WorldMapSceneIsland");
    const tileset2 = map.addTilesetImage("16", "WorldMapSceneIsland");
    const tileset3 = map.addTilesetImage("17", "WorldMapSceneIsland");
    const tileset4 = map.addTilesetImage("Bridge_All", "WorldMapSceneIsland");
    const tileset5 = map.addTilesetImage("Castle_Purple", "WorldMapSceneIsland");
    const tileset6 = map.addTilesetImage("Goblin_House", "WorldMapSceneIsland");
    const tileset7 = map.addTilesetImage("HappySheep_All", "WorldMapSceneIsland");
    const tileset8 = map.addTilesetImage("Rocks_03", "WorldMapSceneIsland");
    const tileset9 = map.addTilesetImage("Tilemap_Elevation", "WorldMapSceneIsland");
    const tileset10 = map.addTilesetImage("Tilemap_Flat", "WorldMapSceneIsland");
    const tileset11 = map.addTilesetImage("Tree", "WorldMapSceneIsland");
    const tileset12 = map.addTilesetImage("W_Idle", "WorldMapSceneIsland");
    const tileset13 = map.addTilesetImage("Water", "WorldMapSceneIsland");


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
