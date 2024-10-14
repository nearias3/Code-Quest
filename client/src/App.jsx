import { useEffect } from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./graphql/client";
import GameScene from "./scenes/GameScene"; // Import GameScene

const App = () => {
  useEffect(() => {
    // Initialize the Phaser game when the component mounts
    new GameScene(); // Instantiate GameScene or handle Phaser initialization here
  }, []);

  return (
    <ApolloProvider client={client}>
      {/* Add any additional React components here */}
    </ApolloProvider>
  );
};

export default App;
