const Contact = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Contact Us</h1>
      <p>
        If you have any questions, suggestions, or just want to say hello, feel
        free to reach out to us!
      </p>
      <ul>
        <li>
          Email:{" "}
          <a href="mailto:askwizardsapprentice@gmail.com">
            askwizardsapprentice@gmail.com
          </a>
        </li>
        <li>
          Twitter:{" "}
          <a
            href="https://x.com/wizsapprentice"
            target="_blank"
            rel="noreferrer"
          >
            @wizsapprentice
          </a>
        </li>
        <li>
          GitHub: <a href="https://github.com/A-Morones"> Adalberto M </a> |
          <a href="https://github.com/cneale92"> Connor N </a> |
          <a href="https://github.com/horizonbound0"> Ken W </a> |
          <a href="https://github.com/nearias"> Nicole H </a>
        </li>
      </ul>
    </div>
  );
};

export default Contact;
