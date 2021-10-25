import React from 'react';
import { ThemeProvider } from '@react95/core';
import { createGlobalStyle } from 'styled-components';
import { BrowserRouter, Switch } from 'react-router-dom';

import routes from './routes';
import AuthProvider from './services/auth';
import AlertProvider from './services/alert';
import ApolloProvider from './services/apollo';
import LoadingProvider from './services/loading';
import SocketProvider from './services/socket';

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #6ca8a9;
  }
`;

const App: React.FC<{}> = () => (
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <ThemeProvider>
      <AlertProvider>
        <AuthProvider>
          <LoadingProvider>
            <ApolloProvider>
              <SocketProvider>
                <GlobalStyles />
                <Switch>
                  {routes.map(
                    ({ key, routeComponent: RouteComponent, ...rest }) => (
                      <RouteComponent {...rest} key={key} />
                    ),
                  )}
                </Switch>
              </SocketProvider>
            </ApolloProvider>
          </LoadingProvider>
        </AuthProvider>
      </AlertProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
