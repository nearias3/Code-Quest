import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    // Load assets (sprites, images, etc.)
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