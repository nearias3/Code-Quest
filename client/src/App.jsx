import ApolloProvider from "./utils/ApolloProvider";
import Layout from "./components/Layout";
import HomePage from "./pages/Homepage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./assets/css/styles.css"; 

const App = () => {
  const handleLogin = () => {
    console.log("User logged in!");
  };

  return (
    <ApolloProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage onLogin={handleLogin} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </Layout>
      </Router>
    </ApolloProvider>
  );
};

export default App;
