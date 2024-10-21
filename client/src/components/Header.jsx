import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <div className="header-container">
        <h1>Wizard&apos;s Apprentice</h1>
        <h3>Pieces of the Master</h3>
        <nav>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
