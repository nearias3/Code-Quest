import { gql } from "@apollo/client";

// Mutation for user signup
export const SIGNUP_USER = gql`
  mutation signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      token
      username
    }
  }
`;

// Mutation for user login
export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      username
    }
  }
`;



