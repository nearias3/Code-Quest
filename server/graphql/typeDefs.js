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

  type Enemy {
    _id: ID
    name: String!
    desc: String
  }
  
  type Item {
    _id: ID
    name: String!
    desc: String
  }

  type Query {
    me: User
    getSaveSlots(userId: ID!): [SaveSlot]
    enemies: [Enemy]
    items: [Item]    
  }

  type AuthPayload {
    token: String!
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): User
    login(username: String!, password: String!): User
    saveGame(
      userId: ID!
      slotNumber: Int!
      playerStats: JSON!
      progress: JSON!
    ): SaveSlot
    loadGame(userId: ID!, slotNumber: Int!): SaveSlot
    addEnemy(name: String!, desc: String ): Enemy
    removeEnemy(name: String!): Enemy
    addItem(name: String!, desc: String ): Item
    removeItem(name: String!): Item
  }
`;

module.exports = typeDefs;
