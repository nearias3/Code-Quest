import GameArea from "../components/GameArea";
import PropTypes from "prop-types";

const Homepage = ({ onLogin }) => {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <GameArea onLogin={onLogin} />
    </div>
  );
};

Homepage.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Homepage;
