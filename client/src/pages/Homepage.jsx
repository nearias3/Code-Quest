import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Homepage = ({ progress }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token and log the user out
    navigate("/");
  };

  const handleCheckProgress = () => {
    console.log("User progress:", progress); // Simulate checking progress (we can enhance this later)
  };

  const handleResumeChallenge = () => {
    const lastStage = progress.length ? progress[progress.length - 1] : "html"; // Assume 'html' is the first stage
    navigate(`/${lastStage}`);
  };

  return (
    <div>
      <h1>Welcome to Code Quest</h1>
      <button onClick={handleLogout}>Log Out</button>
      <button onClick={handleCheckProgress}>Check Progress</button>
      <button onClick={handleResumeChallenge}>Resume Challenge</button>
    </div>
  );
};

// Prop validation
Homepage.propTypes = {
  progress: PropTypes.arrayOf(PropTypes.string).isRequired, 
};

export default Homepage;
