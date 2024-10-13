import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ApolloProvider from "./utils/ApolloProvider.jsx";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider>
    <App />
  </ApolloProvider>
);
