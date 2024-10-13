import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GameArea from "./components/GameArea";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import "./App.css";

function App() {

  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/newgame" element={<GameArea />} />
          {/* More routes for Load Game, Settings, etc. as needed*/}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
