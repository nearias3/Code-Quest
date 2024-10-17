const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, SaveSlot } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

const resolvers = {
  JSON: new GraphQLScalarType({
    name: "JSON",
    description: "Custom JSON scalar type",
    parseValue(value) {
      return typeof value === "object" ? value : JSON.parse(value); // Parse from client input
    },
    serialize(value) {
      return typeof value === "object" ? value : JSON.stringify(value); // Return JSON as a string
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return JSON.parse(ast.value); // Parse string literals
      }
      return null;
    },
  }),

  Query: {
    me: async (_, __, { user }) => {
      if (!user) {
        throw new AuthenticationError("Not logged in");
      }
      return User.findById(user._id);
    },
    getSaveSlots: async (_, { userId }) => {
      return await SaveSlot.find({ userId });
    },
  },
  
  Mutation: {
    login: async (_, { username, password }) => {
      const normalizedUsername = username.trim().toLowerCase();
      const user = await User.findOne({ username: normalizedUsername });
      if (!user) {
        throw new AuthenticationError("Invalid credentials");
      }
      const correctPw = await bcrypt.compare(password, user.password);
      if (!correctPw) {
        throw new AuthenticationError("Invalid credentials");
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      return { ...user._doc, token };
    },
    signup: async (_, { username, email, password }) => {
      const normalizedUsername = username.trim().toLowerCase();
      const hashedPw = await bcrypt.hash(password, 10);
      const user = await User.create({
        username: normalizedUsername,
        email,
        password: hashedPw,
      });
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      return { ...user._doc, token };
    },
    saveGame: async (_, { userId, slotNumber, playerStats, progress }) => {
      const saveSlot = await SaveSlot.findOneAndUpdate(
        { userId, slotNumber },
        { playerStats, progress },
        { upsert: true, new: true } // Create or update
      );
      return saveSlot;
    },
    loadGame: async (_, { userId, slotNumber }) => {
      const saveSlot = await SaveSlot.findOne({ userId, slotNumber });
      if (!saveSlot) {
        throw new Error("No saved game found in this slot.");
      }
      return saveSlot;
    },
  },
};

module.exports = resolvers;
