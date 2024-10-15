import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import GameScene from './GameScene';

const GameArea = () => {
  const gameContainerRef = useRef(null); // creates a reference for the game container

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: gameContainerRef.current, // phaser gets attached to this div
      width: 800,
      height: 600,
      scene: [GameScene],
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false, // disables a default physics debug draw
        },
      },
    };

    const game = new Phaser.Game(config);

    return () => {
      // cleanup function
      game.destroy(true);
    };
  }, []);

  return (
    <div className="game-area">
      <h2>Game Window</h2>
      <div
        id="game-container"
        ref={gameContainerRef}
        style={{ width: "800px", height: "600px" }}
      ></div>{" "}
      {/* This is where the Phaser game will be embedded */}
    </div>
  );
};

export default GameArea;
