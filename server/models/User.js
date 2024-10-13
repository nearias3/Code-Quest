const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  progress: {
    type: [String], // Track completed stages
    default: [], // The user can start with no stages completed / blank progress
  },
});

module.exports = mongoose.model("User", userSchema);
