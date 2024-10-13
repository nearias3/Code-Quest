const jwt = require("jsonwebtoken");

const authMiddleware = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      return user;
    } catch {
      console.error("Invalid token");
    }
  }
  return null;
};

module.exports = { authMiddleware };
