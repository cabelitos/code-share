import { gql } from '@apollo/client';

export default gql`
  mutation CreateInterview($input: CreateInterviewInput!) {
    createInterview(input: $input) {
      id
    }
  }
`;
