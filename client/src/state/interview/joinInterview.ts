import { gql } from '@apollo/client';

export default gql`
  mutation JoinInterview($input: JoinInterviewInput!) {
    joinInterview(input: $input) {
      id
    }
  }
`;
