import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import { createHttpLink } from "@apollo/client";
import fetch from "cross-fetch";


// Define the mutation for signup
const SIGNUP_USER = gql`
  mutation signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      _id
      username
      email
      token
    }
  }
`;

// Define the mutation for login
const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      _id
      username
      token
    }
  }
`;

// Apollo Client setup pointing to graphql
const client = new ApolloClient({
  link: createHttpLink({
    uri:
      import.meta.env.VITE_GRAPHQL_SERVER_URI ||
      "http://localhost:4000/graphql",
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

// Define the mutation for signup
export async function signupUser(username, email, password) {
  const { data } = await client.mutate({
    mutation: SIGNUP_USER,
    variables: { username, email, password },
  });
  return data.signup;
}