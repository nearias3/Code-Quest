const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar JSON
  
  type User {
    _id: ID!
    username: String!
    email: String!
    token: String
  }

  type SaveSlot {
    _id: ID
    userId: ID
    slotNumber: Int
    playerStats: JSON
    progress: JSON
  }

  type Query {
    me: User
    getSaveSlots(userId: ID!): [SaveSlot]
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): User
    login(username: String!, password: String!): User
    saveGame(userId: ID!, slotNumber: Int!, playerStats: JSON!, progress: JSON!): SaveSlot
    loadGame(userId: ID!, slotNumber: Int!): SaveSlot
  }
`;

module.exports = typeDefs;
