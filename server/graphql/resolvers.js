const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) {
        throw new AuthenticationError("Not logged in");
      }
      return User.findById(user._id);
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
      const user = await User.create({ username: normalizedUsername, email, password: hashedPw });
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      return { ...user._doc, token };
    },
  },
};

module.exports = resolvers;
