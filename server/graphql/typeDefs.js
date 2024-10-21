const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    progress: [String] # This is where we store the stages the user has already completed
    token: String
  }

  type Enemy {
    _id: ID
    name: String
  }

  type Item {
    _id: ID
    name: String
  }

  type Query {
    me: User
    items: [Item]
    enemies: [Enemy]
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): User
    login(username: String!, password: String!): User
    addEnemy(name: String!): Enemy
    removeEnemy(name: String!): Enemy
    addItem(name: String!): Item
    removeItem(name: String!): Item
  }
`;

module.exports = typeDefs;
