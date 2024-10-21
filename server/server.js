const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { authMiddleware, verifyToken } = require("./utils/auth");
require("dotenv").config();

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();

  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  // MongoDB Schema (might need to move this into a different file)
  const SaveSlotSchema = new mongoose.Schema({
    userId: String,
    slotNumber: Number,
    playerStats: Object,
    progress: Object,
  });

  const SaveSlot = mongoose.model("SaveSlot", SaveSlotSchema);

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

  app.listen(4000, () => {
    console.log("Server is running at http://localhost:4000/graphql");
  });
}

startServer();
