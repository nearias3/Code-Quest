import { gql, ApolloClient, InMemoryCache } from "@apollo/client";

// Define the mutation for login
const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

export async function loginUser(username, password) {
  const { data } = await client.mutate({
    mutation: LOGIN_USER,
    variables: { username, password },
  });
  return data;
}
