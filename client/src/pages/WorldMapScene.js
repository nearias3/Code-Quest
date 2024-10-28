import Phaser from "phaser";
import GameHelpers from "../utils/GameHelpers";

class WorldMapScene extends Phaser.Scene {
  constructor() {
    super({ key: "WorldMapScene" });
    this.isPaused = false;
    this.interactionText = null; // For showing interaction text
    this.coordinatesText = null; // For showing coordinates
    this.interactionRange = 100; // Distance threshold for interaction text visibility
    this.lastInteractionSquare = null; // Track the last interacted square
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

    // Add your images
    this.add.image(0, 0, "02");
    this.add.image(0, 0, "16");
    this.add.image(0, 0, "17");
    this.add.image(0, 0, "Bridge_All");
    this.add.image(0, 0, "Castle_Purple");
    this.add.image(0, 0, "Goblin_House");
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

    // Create a static group for collision objects
    const collisionGroup = this.physics.add.staticGroup();

    // Create collision bodies from the collision layer
    const collisionLayer = map.getObjectLayer("Collision");
    if (collisionLayer) {
      collisionLayer.objects.forEach((obj) => {
        if (obj.width > 0 && obj.height > 0) {
          // Create a static rectangle for collision
          collisionGroup
            .create(obj.x + obj.width / 2, obj.y + obj.height / 2, null)
            .setSize(obj.width, obj.height)
            .setOrigin(0.5, 0.5)
            .setVisible(false); // Set the collision object to be invisible
        }
      });
    }

    GameHelpers.createPlayer(this);
    const startX = 250; // Change to your desired X position
    const startY = 200; // Change to your desired Y position
    this.player.setPosition(startX, startY);

    // Set the world bounds to match the tilemap size
    const width = map.widthInPixels;
    const height = map.heightInPixels;
    this.physics.world.setBounds(0, 0, width, height); // Set world bounds

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

    // Listen for the "E" key to interact
    this.input.keyboard.on("keydown-E", () => {
      console.log("Interact action triggered");
      this.checkInteractables();
    });

    // Create interaction text
    this.interactionText = this.add
      .text(startX, startY - 40, "Press E to Interact", {
        fontSize: "16px",
        fill: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 5, y: 5 },
        align: "center",
      })
      .setOrigin(0.5, 0.5)
      .setVisible(false); // Initially hidden

    // Create invisible squares
    this.createInteractableSquares();

    // Create coordinates text
    this.coordinatesText = this.add
      .text(10, 10, `X: ${startX}, Y: ${startY}`, {
        fontSize: "16px",
        fill: "#ffffff",
      })
      .setScrollFactor(0); // Fix the coordinates text to the camera

    // Camera that follows the player
    this.cameras.main.setBounds(0, 0, width, height); // Set the camera bounds
    this.cameras.main.startFollow(this.player); // Camera follows the player

    // Ensure the player can't move out of the world bounds
    this.player.setCollideWorldBounds(true);

    // Set up collision between the player and the collision group
    this.physics.add.collider(this.player, collisionGroup);

    // Check for proximity to interactable objects
    this.physics.add.overlap(
      this.player,
      collisionGroup,
      this.showInteractionText,
      null,
      this
    );
  }

  update() {
    GameHelpers.handlePlayerMovement(this, this.cursors, this.player);
    // Update coordinates text to stay in the top left corner
    this.coordinatesText.setText(
      `X: ${Math.round(this.player.x)}, Y: ${Math.round(this.player.y)}`
    );

    // Check distance to the last interacted square
    if (this.lastInteractionSquare) {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.lastInteractionSquare.x,
        this.lastInteractionSquare.y
      );
      if (distance > this.interactionRange) {
        this.hideInteractionText();
        this.lastInteractionSquare = null; // Reset the last interacted square
      }
    }
  }

  showInteractionText(player, object) {
    this.interactionText.setVisible(true);
    this.interactionText.setPosition(player.x, player.y - 40); // Adjust position above the player
    this.lastInteractionSquare = object; // Store the last interacted square
  }

  hideInteractionText() {
    this.interactionText.setVisible(false);
  }

  createInteractableSquares() {
    const squarePositions = [
      { x: 325, y: 1045, scene: "BattleScene1" },
      { x: 516, y: 908, scene: "BattleScene2" },
      { x: 1634, y: 873, scene: "BattleScene3" },
      { x: 1572, y: 353, scene: "BattleScene4" },
    ];

    squarePositions.forEach((pos) => {
      const square = this.add.rectangle(pos.x, pos.y, 30, 30, 0x000000, 0); // Create invisible square
      this.physics.add.existing(square, true); // Make it static for collision
      square.setOrigin(0.5, 0.5);
      this.physics.add.overlap(
        this.player,
        square,
        this.showInteractionText,
        null,
        this
      );
      square.setInteractive(); // Make it interactive
      square.sceneName = pos.scene; // Store the scene name for interaction
    });
  }

  checkInteractables() {
    this.physics.overlap(
      this.player,
      this.children.list.filter((child) => child.fillColor === 0x000000),
      (player, square) => {
        console.log("Interacting with square");
        this.scene.start(square.sceneName); // Start the respective BattleScene
      }
    );
  }
}

export default WorldMapScene;
