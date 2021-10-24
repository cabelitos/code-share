import { gql } from '@apollo/client';

export default gql`
  query CurrentInterview {
    currentInterview {
      id
    }
  }
`;
