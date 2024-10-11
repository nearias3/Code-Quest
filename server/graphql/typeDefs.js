const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    progress: [String] # This is where we store the stages the user has already completed
    token: String
  }

  type Challenge {
    _id: ID
    type: String # These will be things like HTML, CSS, JavaScript, SQL, etc.
    description: String
    solution: String
  }

  type Query {
    me: User
    challenges(type: String!): [Challenge]
  }

  type Mutation {
    login(username: String!, password: String!): User
    signup(username: String!, email: String!, password: String!): User
    completeChallenge(challengeId: ID!): User
  }
`;

module.exports = typeDefs;
