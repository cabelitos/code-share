import React from 'react';
import { Cursor } from '@react95/core';
import { createGlobalStyle } from 'styled-components';

import { useAuth } from '../auth';

const LoadingCursor = createGlobalStyle`
  body {
    ${Cursor.Wait}
  }
`;

interface LoadingContextData {
  setIsLoading: (isLoading: boolean) => void;
}

const LoadingContext = React.createContext<LoadingContextData>({
  setIsLoading: (_: boolean) => {},
});

export const useLoading = (): LoadingContextData =>
  React.useContext(LoadingContext);

const LoadingProvider: React.FC<{}> = ({ children }) => {
  const { isLoading: isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const value = React.useMemo(() => ({ setIsLoading }), []);
  return (
    <LoadingContext.Provider value={value}>
      {(isAuthLoading || isLoading) && <LoadingCursor />}
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
