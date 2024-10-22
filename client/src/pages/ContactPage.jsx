const Contact = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Contact Us</h1>
      <p>
        If you have any questions, suggestions, or just want to say hello, feel
        free to reach out to us!
      </p>
      <ul>
        <li>Email: support@wizardsapprentice.com</li>
        <li>
          Twitter:{" "}
          <a
            href="https://twitter.com/wizards_apprentice"
            target="_blank"
            rel="noreferrer"
          >
            @wizards_apprentice
          </a>
        </li>
        <li>
          GitHub:{" "}
          <a
            href="https://github.com/wizards-apprentice"
            target="_blank"
            rel="noreferrer"
          >
            Our GitHub
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Contact;
