const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const { authMiddleware, verifyToken } = require("./utils/auth");
require("dotenv").config();

const PORT = process.env.PORT || 4000;

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();

  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  // MongoDB Schema
  const SaveSlotSchema = new mongoose.Schema({
    userId: String,
    slotNumber: Number,
    playerStats: Object,
    progress: Object,
  });

  const SaveSlot = mongoose.model("SaveSlot", SaveSlotSchema);

  // Signup route
  app.post("/api/signup", async (req, res) => {
    const { username, email, password } = req.body;

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      // Save the user to the database
      await newUser.save();

      // Create a JWT token
      const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(201).json({ token });
    } catch (error) {
      console.error("Error during signup:", error);
      res.status(500).json({ message: "Signup failed", error });
    }
  });

  // Login route
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      // Check the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Create a JWT token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ token });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Login failed", error });
    }
  });

  // Route to save the game
  app.post("/api/save-game", async (req, res) => {
    // Mark the route handler as async
    const user = authMiddleware(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { slotNumber, playerStats, progress } = req.body;

    try {
      // Saves game to the specified slot (1, 2, or 3)
      const saveSlot = await SaveSlot.findOneAndUpdate(
        { userId: user._id, slotNumber },
        { playerStats, progress },
        { new: true, upsert: true }
      );

      res.json({ message: "Game saved successfully", saveSlot });
    } catch (error) {
      console.error("Error saving game:", error);
      res.status(500).json({ message: "Failed to save game", error });
    }
  });

  // Route to load the game
  app.post("/api/load-game", async (req, res) => {
    const user = authMiddleware(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { slotNumber } = req.body;

    try {
      const saveSlot = await SaveSlot.findOne({ userId: user._id, slotNumber });
      if (!saveSlot) {
        return res
          .status(404)
          .json({ message: "No save found for this slot." });
      }

      res.json(saveSlot); // Return the saved data
    } catch (error) {
      console.error("Error loading game:", error);
      res.status(500).json({ message: "Failed to load game", error });
    }
  });

  // Route to load the game (GET request with slotNumber in the URL)
  app.get("/api/load-game/:slotNumber", async (req, res) => {
    const user = authMiddleware(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { slotNumber } = req.params; // Get slotNumber from the URL

    try {
      const saveSlot = await SaveSlot.findOne({ userId: user._id, slotNumber });
      if (!saveSlot) {
        return res
          .status(404)
          .json({ message: "No save found for this slot." });
      }

      res.json(saveSlot); // Return the saved data
    } catch (error) {
      console.error("Error loading game:", error);
      res.status(500).json({ message: "Failed to load game", error });
    }
  });

  // Serve static files from the client/dist folder
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // For any routes that don't match the API routes, serve the index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });

  // Connect to the server
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: ({ req }) => ({ user: authMiddleware(req) }),
    })
  );

  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/graphql`);
  });
}

startServer();
