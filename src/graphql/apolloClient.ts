import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  // uri: "http://localhost:8080/v1/graphql",
  uri: "https://indexer.bigdevenergy.link/69b99d8/v1/graphql",
  cache: new InMemoryCache(),
});

export default client;
