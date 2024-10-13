import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import HtmlStage from "./pages/HtmlStage.jsx";
import CssStage from "./pages/CssStage.jsx";
import JsStage from "./pages/JsStage.jsx";
import SqlStage from "./pages/SqlStage.jsx";
import GraphQLStage from "./pages/GraphQLStage.jsx";
import FinalBoss from "./pages/FinalBoss.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/html" element={<HtmlStage />} />
        <Route path="/css" element={<CssStage />} />
        <Route path="/javascript" element={<JsStage />} />
        <Route path="/sql" element={<SqlStage />} />
        <Route path="/graphql" element={<GraphQLStage />} />
        <Route path="/final-boss" element={<FinalBoss />} />
      </Routes>
    </Router>
  );
}

export default App;
