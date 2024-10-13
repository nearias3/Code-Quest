import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <div className="header-container">
        <h1>Wizard&apos;s Apprentice</h1>
        <h3>Pieces of the Master</h3>
        <nav>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
          <div className="dropdown">
            <button className="dropbtn">Game Menu</button>
            <div className="dropdown-content">
              <Link to="/newgame">New Game</Link>
              <Link to="/loadgame">Load Game</Link>
              <Link to="/settings">Settings</Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
