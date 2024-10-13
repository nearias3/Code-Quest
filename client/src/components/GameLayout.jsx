import React from "react";

const GameLayout = ({ stageTitle, challengeDescription, children }) => {
  return (
    <div>
      <h1>{stageTitle}</h1>
      <p>{challengeDescription}</p>
      <div>{children}</div>{" "}
      {/* This is where we'll embed the code editor or other game components */}
    </div>
  );
};

export default GameLayout;
