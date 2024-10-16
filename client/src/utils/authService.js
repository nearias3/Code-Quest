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

// Define the mutation for signup
const SIGNUP_USER = gql`
  mutation signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
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

/// Signup function
export async function signupUser(username, email, password) {
  try {
    const response = await client.mutate({
      mutation: SIGNUP_USER,
      variables: { username, email, password },
    });

    console.log("Signup response:", response);

    if (!response.data || !response.data.signup) {
      throw new Error("Signup failed. Please try again.");
    }

    return response.data;
  } catch (error) {
    console.error("Signup error:", error);
    throw new Error("Signup failed. Please try again."); // Ensure error is thrown and caught in GameScene.js
  }
}
