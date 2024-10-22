import PropTypes from "prop-types";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as Provider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri:
    import.meta.env.VITE_GRAPHQL_SERVER_URI ||
    "https://wizard-s-apprentice.onrender.com/graphql",
  fetch,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


const ApolloProvider = ({ children }) => {
  return <Provider client={client}>{children}</Provider>;
};

ApolloProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ApolloProvider;
