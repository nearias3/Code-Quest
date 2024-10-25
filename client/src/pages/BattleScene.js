import Phaser from "phaser";

class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: "BattleScene" });
    this.playerHealth = 250;
    this.enemyHealth = [50, 50, 50];
    this.currentTurn = "player";
  }

  preload() {
    this.load.image("background", "/assets/placeholderBattleBackground.png");
    this.load.image("player", "/assets/techmage.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.image("enemy", "/assets/skeleton.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    this.add.image(400, 300, "background");
    this.player = this.physics.add.sprite(200, 400, "player").setScale(0.1);
    this.playerHealthText = this.add.text(
      10,
      10,
      `Player Health: ${this.playerHealth}`,
      { fontSize: "16px", fill: "#fff" }
    );

    // Create health bar for player
    this.playerHealthBar = this.add.graphics();
    this.drawHealthBar(
      this.playerHealthBar,
      this.player.x,
      this.player.y - 20,
      this.playerHealth,
      100
    );

    this.enemies = this.physics.add.group();
    this.createEnemies();
    this.createAnimations();
    this.player.play("player_idle");
    this.enemies.children.iterate((enemy) => {
      enemy.play("enemy_idle");
    });

    this.input.on("pointerdown", this.handleAttack, this);
  }

  createEnemies() {
    const enemyPositions = [
      { x: 500, y: 275 },
      { x: 600, y: 275 },
      { x: 700, y: 275 },
    ];

    enemyPositions.forEach((pos, index) => {
      const enemy = this.physics.add
        .sprite(pos.x, pos.y, "enemy")
        .setScale(-0.1, 0.1); // Flip enemy horizontally
      enemy.health = 50;
      this.enemies.add(enemy);

      // Create health bar for each enemy
      enemy.healthBar = this.add.graphics();
      this.drawHealthBar(
        enemy.healthBar,
        enemy.x,
        enemy.y - 20,
        enemy.health,
        50
      );
    });
  }

  drawHealthBar(graphics, x, y, currentHealth, maxHealth) {
    graphics.clear();
    graphics.fillStyle(0xff0000, 1); // Red color for the health bar
    graphics.fillRect(x - 25, y, 50, 8); // Background health bar
    graphics.fillStyle(0x00ff00, 1); // Green color for current health
    const healthWidth = (currentHealth / maxHealth) * 50; // Calculate width based on health
    graphics.fillRect(x - 25, y, healthWidth, 8); // Current health bar
  }

  createAnimations() {
    this.anims.create({
      key: "player_idle",
      frames: [{ key: "player", frame: 0 }],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "enemy_idle",
      frames: [{ key: "enemy", frame: 0 }],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "attack_animation",
      frames: [{ key: "player", frame: 1 }],
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "enemy_attack",
      frames: [{ key: "enemy", frame: 1 }],
      frameRate: 10,
      repeat: 0,
    });
  }

  handleAttack() {
    if (this.currentTurn === "player") {
      const enemy = this.enemies.getChildren().find((e) => e.health > 0);
      if (enemy) {
        this.attackAnimation(enemy);
      }
    }
  }

  attackAnimation(enemy) {
    this.player.play("attack_animation");
    this.player.once("animationcomplete", () => {
      const damage = Phaser.Math.Between(5, 15);
      enemy.health -= damage;
      this.updateHealthText(enemy);
      this.player.setTexture("player", 0);
      this.drawHealthBar(
        enemy.healthBar,
        enemy.x,
        enemy.y - 20,
        enemy.health,
        50
      ); // Update enemy health bar

      if (enemy.health <= 0) {
        this.enemies.remove(enemy, true); // Remove enemy if defeated
      }

      if (this.enemies.getLength() === 0) {
        this.endBattle("You Win!");
      } else {
        this.currentTurn = "enemy"; // Switch to enemy turn
        this.enemyTurn();
      }
    });
  }

  updateHealthText(enemy) {
    this.playerHealthText.setText(`Player Health: ${this.playerHealth}`);
    if (enemy.health <= 0) {
      this.add.text(enemy.x, enemy.y - 20, "Defeated", {
        fontSize: "16px",
        fill: "#f00",
      });
    }
  }

  enemyTurn() {
    this.enemies.getChildren().forEach((enemy) => {
      if (enemy.health > 0) {
        // Enemy attacks the player
        enemy.play("enemy_attack");
        this.time.delayedCall(
          500,
          () => {
            // Delay to allow animation to play
            const damage = Phaser.Math.Between(5, 10); // Random enemy damage between 5 and 10
            this.playerHealth -= damage; // Enemy deals damage
            this.playerHealthText.setText(
              `Player Health: ${this.playerHealth}`
            );
            this.drawHealthBar(
              this.playerHealthBar,
              this.player.x,
              this.player.y - 20,
              this.playerHealth,
              100
            ); // Update player health bar

            if (this.playerHealth <= 0) {
              this.endBattle("Game Over!");
            }
          },
          [],
          this
        );
      }
    });

    this.currentTurn = "player"; // Switch back to player turn
  }

  endBattle(message) {
    this.add
      .text(400, 300, message, { fontSize: "32px", fill: "#fff" })
      .setOrigin(0.5);
    this.input.off("pointerdown"); // Disable input
    this.time.delayedCall(2000, () => {
      this.scene.start("SomeOtherScene"); // Transition to another scene after 2 seconds
    });
  }

  update() {
    // Handle any ongoing updates if necessary
  }
}

export default BattleScene;
