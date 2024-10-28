import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import GameScene from "../pages/GameScene";
import WorldMapScene from "../pages/WorldMapScene";
import BattleScene from "../pages/BattleScene";
import BattleScene1 from "../pages/BattleScene1";
import BattleScene2 from "../pages/BattleScene2";
import BattleScene3 from "../pages/BattleScene3";
import BattleScene4 from "../pages/BattleScene4";
import TutorialScene from "../pages/TutorialScene";
import PropTypes from "prop-types";

const GameArea = ({ onLogin }) => {
  const gameContainerRef = useRef(null); // creates a reference for the game container

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: gameContainerRef.current, // phaser gets attached to this div
      width: 800,
      height: 600,
      scene: [
        GameScene,
        TutorialScene,
        WorldMapScene,
        BattleScene,
        BattleScene1,
        BattleScene2,
        BattleScene3,
        BattleScene4,
      ],
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
        noAudio: true, // Disabled audio
      },
    };

    const game = new Phaser.Game(config);


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
