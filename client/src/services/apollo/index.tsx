import React from 'react';
import {
  ApolloClient,
  ApolloProvider as RealApolloProvider,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../auth';
import { AlertType, useAlert } from '../alert';
import { useLoading } from '../loading';
import usePrevious from '../../hooks/usePrevious';
import useUpdatedRef from '../../hooks/useUpdatedRef';

const ApolloProvider: React.FC<{}> = ({ children }) => {
  const useAuthData = useAuth();
  const useLoadingData = useLoading();
  const { addAlert } = useAlert();
  const { t } = useTranslation('login');
  const alertTitle = t('error');
  const ctxRef = useUpdatedRef({
    alertTitle,
    addAlert,
    useAuthData,
    useLoadingData,
  });

  const clientRef = React.useRef<ApolloClient<unknown> | null>(null);
  const previousAuthData = usePrevious(useAuthData.authData);

  const getInstance = React.useCallback((): ApolloClient<unknown> => {
    if (!clientRef.current) {
      const loadingLink = new ApolloLink((operation, forward) => {
        ctxRef.current.useLoadingData.setIsLoading(true);
        return forward(operation).map(data => {
          ctxRef.current.useLoadingData.setIsLoading(false);
          return data;
        });
      });
      const httpLink = createHttpLink({
        uri: `${process.env.REACT_APP_SERVICE_URL}${process.env.REACT_APP_GRAPHQL_PATH}`,
      });
      const authLink = setContext((_, { headers }) => {
        const {
          useAuthData: { authData },
        } = ctxRef.current;
        return {
          headers: {
            ...headers,
            authorization: authData?.accessToken
              ? `Bearer ${authData?.accessToken}`
              : '',
          },
        };
      });
      const errorLink = onError(({ networkError, graphQLErrors }) => {
        if (
          networkError &&
          'statusCode' in networkError &&
          networkError.statusCode === 401
        ) {
          ctxRef.current.useAuthData.logout();
          return;
        }
        graphQLErrors?.forEach(err => {
          ctxRef.current.addAlert({
            type: AlertType.ERROR,
            title: ctxRef.current.alertTitle,
            message: err.message,
          });
        });
      });
      clientRef.current = new ApolloClient({
        cache: new InMemoryCache(),
        defaultOptions: {
          mutate: {
            errorPolicy: 'all',
          },
          query: {
            errorPolicy: 'all',
          },
          watchQuery: {
            errorPolicy: 'all',
          },
        },
        link: from([errorLink, loadingLink, authLink, httpLink]),
      });
    }
    return clientRef.current;
  }, [ctxRef]);

  const client = getInstance();
  React.useEffect(() => {
    if (previousAuthData && !useAuthData.authData) {
      client.stop();
      // eslint-disable-next-line no-console
      client.clearStore().catch(console.error);
    }
  }, [client, previousAuthData, useAuthData.authData]);
  return <RealApolloProvider client={client}>{children}</RealApolloProvider>;
};

export default ApolloProvider;
