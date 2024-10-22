import Header from "./Header";
import Footer from "./Footer";
import PropTypes from 'prop-types';
import GameArea from "./GameArea";

const Layout = ({ children, onLogin }) => {
  return (
    <div>
      <Header />
      <GameArea onLogin={onLogin} />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  onLogin: PropTypes.func.isRequired,
};


export default Layout;
