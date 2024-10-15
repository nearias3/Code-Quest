import { useState } from "react";
import { useMutation } from "@apollo/client";
import { SIGNUP_USER } from "../utils/mutations";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [signup, { error }] = useMutation(SIGNUP_USER);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await signup({
        variables: { ...formState },
      });
      // Store the token in localStorage
      localStorage.setItem("token", data.signup.token);
      // Redirect to the HTML stage after signup
      navigate("/html");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formState.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formState.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formState.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      {error && <p>Signup failed. Please try again.</p>}
    </div>
  );
}

export default Signup;
