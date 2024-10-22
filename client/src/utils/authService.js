import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import { createHttpLink } from "@apollo/client";
import fetch from "cross-fetch";

// Define the mutation for login
const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

// Apollo Client setup pointing to graphql
const client = new ApolloClient({
  link: createHttpLink({
    uri: import.meta.env.VITE_GRAPHQL_SERVER_URI, // include this in .env file
    fetch,
  }),
  cache: new InMemoryCache(),
});


// Login function
export async function loginUser(username, password) {
  const { data } = await client.mutate({
    mutation: LOGIN_USER,
    variables: { username, password },
  });
  return data;
}

// Vite environment variable for the API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

/// Signup function
export async function signupUser(username, email, password) {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
    
    const result = await response.json();

    if (!response.data || !response.data.signup) {
      throw new Error("Signup failed. Please try again.");
    }


    return result;
  } catch (error) {
    console.error("Signup error:", error);
    throw new Error("Signup failed. Please try again."); // Ensure error is thrown and caught in GameScene.js
  }
}
