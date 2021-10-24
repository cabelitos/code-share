import { gql } from '@apollo/client';

export default gql`
  mutation EndInterview($input: EndInterviewInput!) {
    endInterview(input: $input) {
      id
      endedAt
    }
  }
`;
