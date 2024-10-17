const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server-express");


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

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header

  if (!token) {
    throw new AuthenticationError("No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Continue to the next middleware or route if any
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = { verifyToken };
module.exports = { authMiddleware };
