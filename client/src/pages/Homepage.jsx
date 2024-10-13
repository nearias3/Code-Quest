import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Modal from "../components/Modal";

const stages = ["html", "css", "javascript", "sql", "graphql"];

const Homepage = ({ progress }) => {
  const [showModal, setShowModal] = useState(false);
  const [lockedStage, setLockedStage] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token and log the user out
    navigate("/");
  };

  const handleStageClick = (stage) => {
    const lastUnlockedStage = progress[progress.length - 1];

    if (stages.indexOf(stage) <= stages.indexOf(lastUnlockedStage)) {
      // If the stage is unlocked, navigate to it
      navigate(`/${stage}`);
    } else {
      // If the stage is locked, show the modal
      setLockedStage(stage);
      setShowModal(true);
    }
  };

  return (
    <div>
      <h1>Code Quest</h1>
      <button onClick={handleLogout}>Log Out</button>

      <h2>Stages</h2>
      <div className="progress-bar">
        {stages.map((stage) => (
          <button
            key={stage}
            className={progress.includes(stage) ? "unlocked" : "locked"}
            onClick={() => handleStageClick(stage)}
          >
            {stage.toUpperCase()}
          </button>
        ))}
      </div>

      {showModal && (
        <Modal
          title="Stage Locked"
          message={`The ${lockedStage.toUpperCase()} stage is locked. Complete the previous stages to unlock it.`}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

// Prop validation
Homepage.propTypes = {
  progress: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Homepage;
