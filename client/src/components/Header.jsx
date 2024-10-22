const Header = () => {
  return (
    <header>
      <nav>
        <ul style={{ display: "flex", justifyContent: "space-between" }}>
          <li>
            <a href="/" style={{ color: "#fff" }}>
              Home
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
