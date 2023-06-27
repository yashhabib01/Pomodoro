"use client";
import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";

export const Providers = ({ children }) => {
  const client = new ApolloClient({
    uri: "https://pomodoro-mwa85gwa2-yashhabib01.vercel.app/api/graphql",
    cache: new InMemoryCache(),
  });
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
