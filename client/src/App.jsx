import ApolloProvider from "./utils/ApolloProvider";
import GameArea from "./components/GameArea.jsx";
import { BrowserRouter as Router } from "react-router-dom";

const App = () => {
  const handleLogin = () => {
    console.log("User logged in!");
  };

  return (
    <ApolloProvider>
      <Router>
        <div>
          <GameArea onLogin={handleLogin} />
        </div>
      </Router>
    </ApolloProvider>
  );
};

export default App;
