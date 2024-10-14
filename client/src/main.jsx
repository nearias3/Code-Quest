import ReactDOM from "react-dom/client";
import App from "./App";
import { registerSW } from "virtual:pwa-register";

registerSW(); // Register the service worker

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
