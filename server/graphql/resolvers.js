const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, SaveSlot, Enemy, Item } = require("../models");
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
    enemies: async () => {
      return await Enemy.find({});
    },
    items: async () => {
      return await Item.find({});
    }
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
     return { _id: user._id, username: user.username, token };
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
      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        token,
      };
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
    addEnemy: async (parent, { name, desc } ) => {
      return Enemy.create({ name, desc });
    },
    removeEnemy: async (parent, { name } ) => {
      return Enemy.findOneAndDelete({ name });
    },
    addItem: async (parent, { name, desc } ) => {
      return Item.create({ name, desc });
    },
    removeItem: async(parent, { name } ) => {
      return Item.findOneAndDelete({ name });
    }
  },
};

module.exports = resolvers;
