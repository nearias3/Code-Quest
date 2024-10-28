import Phaser from "phaser";

class BattleScene3 extends Phaser.Scene {
  constructor() {
    super({ key: "BattleScene3" });
    this.playerHealth = 50; // Updated player health
    this.enemyHealth = [15, 15, 15]; // Updated enemy health
    this.currentTurn = "player";
    this.selectedAttackDamage = 0; // To store selected attack damage
    this.selectedAttackBox = null; // To keep track of the selected attack box
    this.targetedEnemy = null; // Store the selected target
    this.randEnemy = null;
  }

  preload() {
    this.load.image("background", "/assets/placeholderBattleBackground.png");
    this.load.image("player", "/assets/techmage.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.image("semicolon", "/assets/semicolon.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.image("curly-bracket", "/assets/curly-bracket.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    this.add.image(400, 300, "background");
    this.player = this.physics.add.sprite(200, 400, "player").setScale(0.1);

    this.playerHealthBar = this.add.graphics();
    this.drawHealthBar(
      this.playerHealthBar,
      this.player.x - 25,
      this.player.y - 80,
      this.playerHealth,
      50
    );

    this.playerHealthText = this.add
      .text(
        this.player.x - 25,
        this.player.y - 100,
        `${this.playerHealth} / 50`,
        { fontSize: "16px", fill: "#fff" }
      )
      .setOrigin(0.5);

    this.enemies = this.physics.add.group();
    this.createEnemies();
    this.createAnimations();
    this.player.play("player_idle");

    this.createAttackBox();
    this.input.on("pointerdown", this.handlePointerDown, this);
  }

  handlePointerDown(pointer) {
    if (this.selectedAttackDamage > 0) {
      // If an attack is selected, try to select an enemy
      const enemy = this.enemies
        .getChildren()
        .find((e) => e.getBounds().contains(pointer.x, pointer.y));
      if (enemy && enemy.health > 0) {
        this.targetEnemy(enemy);
      }
    }
  }

  createEnemies() {
    const enemyPositions = [
      { x: 500, y: 275 },
      { x: 600, y: 275 },
      { x: 700, y: 275 },
    ];

    enemyPositions.forEach((pos) => {
      const enemy = this.physics.add
        .sprite(pos.x, pos.y, this.randEnemy)
        .setFlip(true, false)
        .setScale(-0.1, 0.1);
      enemy.health = 15;
      this.enemies.add(enemy);

      enemy.healthBar = this.add.graphics();
      this.drawHealthBar(
        enemy.healthBar,
        enemy.x,
        enemy.y - 80,
        enemy.health,
        15
      );

      enemy.setInteractive();
      enemy.on("pointerdown", () => this.targetEnemy(enemy));

      enemy.healthText = this.add
        .text(enemy.x, enemy.y - 90, `${enemy.health} / 15`, {
          fontSize: "14px",
          fill: "#fff",
        })
        .setOrigin(0.5);
    });
  }

  drawHealthBar(graphics, x, y, currentHealth, maxHealth) {
    graphics.clear();
    graphics.fillStyle(0xff0000, 1);
    graphics.fillRect(x - 25, y, 50, 8);
    graphics.fillStyle(0x00ff00, 1);
    const healthWidth = Math.max(0, (currentHealth / maxHealth) * 50);
    graphics.fillRect(x - 25, y, healthWidth, 8);
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
      frames: [{ key: "semicolon", frame: 0 }],
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
      frames: [{ key: "semicolon", frame: 1 }],
      frameRate: 10,
      repeat: 0,
    });
  }

  createAttackBox() {
    const attackBox = this.add.graphics();
    attackBox.fillStyle(0x000000, 0.7);
    attackBox.fillRect(0, 400, 800, 100);

    const attacks = [
      { name: "Fireball", damage: 8 },
      { name: "Wind Cutter", damage: 6 },
      { name: "Water Blast", damage: 8 },
      { name: "Rock Throw", damage: 10 },
    ];

    attacks.forEach((attack, index) => {
      const x = index * 200 + 100;
      const attackBox = this.add
        .rectangle(x, 450, 180, 70, 0xffffff)
        .setOrigin(0.5)
        .setInteractive();

      attackBox.on("pointerdown", () =>
        this.selectAttack(attack.damage, attackBox)
      );

      this.add
        .text(x, 430, attack.name, { fontSize: "16px", fill: "#000" })
        .setOrigin(0.5);
    });
  }

  selectAttack(damage, attackBox) {
    this.selectedAttackDamage = damage;
    this.highlightSelectedAttack(attackBox);
    this.targetedEnemy = null; // Reset targeted enemy
    this.enableEnemySelection(); // Allow selecting enemies
  }

  highlightSelectedAttack(attackBox) {
    if (this.selectedAttackBox) {
      this.selectedAttackBox.setFillStyle(0xffffff);
    }
    this.selectedAttackBox = attackBox;
    attackBox.setFillStyle(0xffff00);
  }

  targetEnemy(enemy) {
    this.targetedEnemy = enemy; // Store reference to the selected target
    this.attackAnimation(enemy);
  }

  attackAnimation() {
    this.player.play("attack_animation");
    this.player.once("animationcomplete", () => {
      if (this.targetedEnemy) {
        this.targetedEnemy.health -= this.selectedAttackDamage;
        this.targetedEnemy.health = Math.max(0, this.targetedEnemy.health);
        this.updateHealthText(this.targetedEnemy);
        this.player.setTexture("player", 0);
        this.drawHealthBar(
          this.targetedEnemy.healthBar,
          this.targetedEnemy.x,
          this.targetedEnemy.y - 80,
          this.targetedEnemy.health,
          15
        );

        if (this.targetedEnemy.health <= 0) {
          this.targetedEnemy.healthBar.clear();
          this.targetedEnemy.healthText.setVisible(false);
          this.enemies.remove(this.targetedEnemy, true);
        }

        if (this.enemies.getLength() === 0) {
          this.endBattle("You Win!");
        } else {
          this.currentTurn = "enemy";
          this.enemyTurn();
        }
      }

      // Reset attack selection and highlight
      this.selectedAttackDamage = 0;
      this.resetAttackHighlight();
      this.disableEnemySelection(); // Disable enemy selection
      this.enableAttackBoxes(); // Re-enable attack boxes
    });
  }

  resetAttackHighlight() {
    if (this.selectedAttackBox) {
      this.selectedAttackBox.setFillStyle(0xffffff);
      this.selectedAttackBox = null;
    }
  }

  updateHealthText(enemy) {
    this.playerHealthText.setText(`${this.playerHealth} / 50`);
    enemy.healthText.setText(`${enemy.health} / 15`);
  }

  enableAttackBoxes() {
    this.children.list.forEach((child) => {
      if (
        child instanceof Phaser.GameObjects.Rectangle &&
        child.height === 70
      ) {
        child.setInteractive(true);
      }
    });
  }

  enableEnemySelection() {
    this.enemies.getChildren().forEach((enemy) => {
      enemy.setInteractive();
    });
  }

  disableEnemySelection() {
    this.enemies.getChildren().forEach((enemy) => {
      enemy.setInteractive(false);
    });
  }

  enemyTurn() {
    this.enemies.getChildren().forEach((enemy) => {
      if (enemy.health > 0) {
        enemy.play("enemy_attack");
        this.time.delayedCall(
          500,
          () => {
            const damage = Phaser.Math.Between(1, 3);
            this.playerHealth -= damage;
            this.playerHealth = Math.max(0, this.playerHealth);
            this.playerHealthText.setText(`${this.playerHealth} / 50`);
            this.drawHealthBar(
              this.playerHealthBar,
              this.player.x - 25,
              this.player.y - 80,
              this.playerHealth,
              50
            );

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
    this.input.off("pointerdown");
    this.time.delayedCall(2000, () => {
      this.scene.start("WorldMapScene");
    });
  }

  update() {}
}

export default BattleScene3;
