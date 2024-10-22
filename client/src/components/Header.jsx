const Header = () => {
  return (
    <header>
      <nav>
          <a href="/" className="logo-container">
            <img
              src="/assets/logotext.png"
              alt="Wizard's Apprentice Logo"
              className="header-logo"
            />
          </a>
        <ul>
          <li>
            <a href="/" style={{ color: "#fff" }}>
              Play
            </a>
          </li>
          <li>
            <a href="/about" style={{ color: "#fff" }}>
              About
            </a>
          </li>
          <li>
            <a href="/contact" style={{ color: "#fff" }}>
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
