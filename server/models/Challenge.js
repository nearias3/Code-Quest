const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["HTML", "CSS", "JavaScript", "SQL", "GraphQL"],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  solution: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Challenge", challengeSchema);
