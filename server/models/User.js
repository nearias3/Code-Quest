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
  saveSlots: [{
    type: mongoose.Schema.ObjectId,
    ref: 'SaveSlot' 
  }],
});

module.exports = mongoose.model("User", userSchema);
