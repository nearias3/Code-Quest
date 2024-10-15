import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import GameScene from '../pages/GameScene';
import PropTypes from "prop-types";

const GameArea = ({ onLogin }) => {
  const gameContainerRef = useRef(null); // creates a reference for the game container

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: gameContainerRef.current, // phaser gets attached to this div
      width: 800,
      height: 600,
      scene: [GameScene],
    };

    const game = new Phaser.Game(config);

    // Listen for Phaser's login event in GameScene.js
     game.scene.keys["GameScene"].events.on("loginEvent", () => {
       onLogin(); // Trigger React login function
     });

    return () => {
      // cleanup function
      game.destroy(true);
    };
  }, [onLogin]);

  return (
    <div className="game-area">
      <h2>Game Area</h2>
      <div
        id="game-container"
        ref={gameContainerRef}
        style={{ width: "800px", height: "600px" }}
      ></div>{" "}
      {/* This is where the Phaser game will be embedded */}
    </div>
  );
};

GameArea.propTypes = {
  onLogin: PropTypes.func.isRequired, 
};

export default GameArea;
