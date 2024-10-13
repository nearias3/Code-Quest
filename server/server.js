const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { authMiddleware } = require("./utils/auth");
require("dotenv").config();

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();

  const app = express();
  app.use(cors());
  app.use(bodyParser.json());


  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: ({ req }) => ({ user: authMiddleware(req) }),
    })
  );

  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
     }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((error) => {
    console.error('MongoDB connection error:', error);
  });

  app.listen(4000, () => {
    console.log("Server is running at http://localhost:4000/graphql");
  });
}

startServer();
