import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import {
  GameScene,
  WorldMapScene,
  BattleScene,
  Map1Scene,
  Map2Scene,
  Map3Scene,
} from "../pages/GameScene.js";
import PropTypes from "prop-types";

const GameArea = ({ onLogin }) => {
  const gameContainerRef = useRef(null); // creates a reference for the game container

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: gameContainerRef.current, // phaser gets attached to this div
      width: 800,
      height: 600,
      scene: [GameScene, WorldMapScene, BattleScene, Map1Scene, Map2Scene, Map3Scene],
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      dom: {
        createContainer: true,
      },
      audio: {
        noAudio: true, // Disabled audio to avoid warning in console until we get actual audio
      },
    };

    const game = new Phaser.Game(config);

    // Once GameScene is loaded, listen for the login event
    const gameScene = game.scene.keys["GameScene"];
    if (gameScene) {
      gameScene.events.on("loginEvent", () => {
        console.log("Login event triggered in Phaser!");
        onLogin(); // Trigger React login function
      });
    }

    return () => {
      game.destroy(true);
    };
  }, [onLogin]);

  return (
    <div
      className="game-area"
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        id="game-container"
        ref={gameContainerRef}
        style={{
          width: "800px",
          height: "600px",
          margin: "0 auto",
          position: "relative",
        }}
      ></div>
    </div>
  );
};

GameArea.propTypes = {
  onLogin: PropTypes.func.isRequired, 
};

export default GameArea;
