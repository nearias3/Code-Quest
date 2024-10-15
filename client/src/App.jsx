import { ApolloProvider } from "@apollo/client";
import client from "./graphql/client";
import GameArea from "./components/GameArea.jsx";
import { BrowserRouter as Router } from "react-router-dom";

const App = () => {
  const handleLogin = () => {
    console.log("User logged in!");
  };

  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <GameArea onLogin={handleLogin} />
        </div>
      </Router>
    </ApolloProvider>
  );
};

export default App;
