import { gql, useApolloClient } from '@apollo/client';
import React from 'react';

import { CurrentInterviewDocument } from '../__generated__';

export const useClearCurrentInterview = (): ((id: string) => void) => {
  const client = useApolloClient();
  const apolloClientRef = React.useRef(client);
  apolloClientRef.current = client;
  return React.useCallback((id: string) => {
    apolloClientRef.current.writeQuery({
      query: CurrentInterviewDocument,
      data: { currentInterview: null },
      variables: {
        id,
      },
    });
  }, []);
};

export default gql`
  query CurrentInterview {
    currentInterview {
      id
    }
  }
`;
