import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HtmlStage from "./pages/HtmlStage";
import CssStage from "./pages/CssStage";
import JsStage from "./pages/JsStage";
import SqlStage from "./pages/SqlStage";
import GraphQLStage from "./pages/GraphQLStage";
import FinalBoss from "./pages/FinalBoss";

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
