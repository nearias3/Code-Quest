import { useState } from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./graphql/client";
import GameArea from "./components/GameArea.jsx";
import Login from "./pages/Login";
import { BrowserRouter as Router } from "react-router-dom";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = () => {
    setShowLogin(true);
  };

  return (
    <ApolloProvider client={client}>
      <Router>
        <div>{showLogin ? <Login /> : <GameArea onLogin={handleLogin} />}</div>
      </Router>
    </ApolloProvider>
  );
};

export default App;
