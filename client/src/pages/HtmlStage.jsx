import { useNavigate } from 'react-router-dom';
import GameLayout from "../components/GameLayout";
import MonacoEditor from "@monaco-editor/react";

const HtmlStage = () => {
  const navigate = useNavigate();
  const challengeDescription =
    "Create a simple HTML page with a heading and a paragraph."; // The actual challenge can vary, for example we can have it be a fill in the blank HTML page or a debug challenge

    // Callback whwen user submits their code
    const handleSubmit = (code) => {
      console.log("Submitted HTML code:", code);
      // Here we send the code to the backend for validation
    };

    const handleExit = () => {
      navigate('/homepage');
    };

  return (
    <GameLayout
      stageTitle="Stage 1: HTML"
      challengeDescription={challengeDescription}>
      <MonacoEditor
        height="400px"
        language="html"
        theme="vs-dark"
        onChange={(value) => handleSubmit(value)} // This striggers the code submition
      />
      <button onClick={() => handleSubmit("code here")}>Submit</button>
      <button onClick={handleExit}>Exit Challenge</button>
    </GameLayout>
  );
};

export default HtmlStage;
