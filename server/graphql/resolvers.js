const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Challenge } = require("../models");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) {
        throw new AuthenticationError("Not logged in");
      }
      return User.findById(user._id);
    },
    challenges: async (_, { type }) => {
      return Challenge.find({ type });
    },
  },
  Mutation: {
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
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
      const hashedPw = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hashedPw });
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      return { ...user._doc, token };
    },
    completeChallenge: async (_, { challengeId }, { user }) => {
      if (!user) {
        throw new AuthenticationError("Not logged in");
      }
      return User.findByIdAndUpdate(
        user._id,
        { $addToSet: { progress: challengeId } },
        { new: true }
      );
    },
  },
};

module.exports = resolvers;
