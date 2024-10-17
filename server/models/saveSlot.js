const mongoose = require("mongoose");

const saveSlotSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  slotNumber: { type: Number, required: true }, // 1, 2, or 3
  playerStats: { type: Object, required: true }, // Player stats (level, health, progress, etc.)
  progress: { type: Object, required: true }, // Any game-specific progress to store
});

module.exports = mongoose.model("SaveSlot", saveSlotSchema);
