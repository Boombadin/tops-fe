import * as Sentry from '@sentry/browser';
import { defaultDataIdFromObject, InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, split } from 'apollo-link';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import nodeFetch from 'node-fetch';
import { ulid } from 'ulid';

const createApolloCache = () => {
  return new InMemoryCache({
    dataIdFromObject: object => {
      switch (object.__typename) {
        case 'ConfigurableProductOptions': {
          return `${object.__typename}:${Number(object.attribute_id)}`; // use the `key` field as the identifier
        }
        default:
          return defaultDataIdFromObject(object); // fall back to default handling
      }
    },
  });
};

const defaultHeader = {};

// create browser apollo client
export const createServerApolloClient = ({ headers, uri, server }) => {
  const cache = createApolloCache();
  const httpLink = new BatchHttpLink({
    uri: uri,
    fetch: server ? nodeFetch : null,
  });

  const authLink = setContext((_, { headers: existingHeader }) => {
    return {
      headers: {
        ...defaultHeader,
        ...existingHeader,
        ...headers,
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message }) => {
        Sentry.captureMessage(
          `[GraphQL error]: Message: ${message}, operation: ${operation?.operationName}`,
          'error',
        );
      });
    }
    if (networkError) {
      Sentry.captureMessage(
        `[Network error]: ${networkError}, operation: ${operation?.operationName}`,
        'error',
      );
    }
  });

  const requestIdLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        'x-request-id': ulid(),
      },
    });
    return forward(operation);
  });

  const client = new ApolloClient({
    link: ApolloLink.from([errorLink, requestIdLink, authLink, httpLink]),
    cache,
    ssrMode: true,
    queryDeduplication: true,
    defaultOptions: {},
  });

  return { client, cache };
};

// create browser apollo client
export const createBrowserApolloClient = ({ headers = {}, uri, cacheData }) => {
  const cache = createApolloCache();
  const tempHeaders = {
    ...defaultHeader,
    ...headers,
  };
  const batchHttpLink = new BatchHttpLink({ uri, headers: tempHeaders });
  const httpLink = new HttpLink({ uri, headers: tempHeaders });
  const requestIdLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        'x-request-id': ulid(),
      },
    });
    return forward(operation);
  });

  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message }) => {
        Sentry.captureMessage(
          `[GraphQL error]: Message: ${message}, operation: ${operation?.operationName}`,
          'error',
        );
      });
    }
    if (networkError) {
      Sentry.captureMessage(
        `[Network error]: ${networkError}, operation: ${operation?.operationName}`,
        'error',
      );
    }
  });

  const client = new ApolloClient({
    link: ApolloLink.from([
      errorLink,
      requestIdLink,
      split(
        operation => operation.getContext().batching === true,
        batchHttpLink,
        httpLink,
      ),
    ]),
    cache: cacheData ? cache.restore(cacheData) : cache,
    queryDeduplication: true,
    defaultOptions: {},
  });

  return { client, cache };
};

export const createGraphqlClient = ({ headers, uri, server, cacheData }) => {
  return server
    ? createServerApolloClient({ headers, uri, server, cacheData })
    : createBrowserApolloClient({ headers, uri, server, cacheData });
};
