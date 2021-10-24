/* eslint-disable */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {"refetchQueries":["CurrentInterview"]}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type CreateInterviewInput = {
  interviewee: Scalars['String'];
};

export type EndInterviewInput = {
  interviewId: Scalars['String'];
};

export type Interview = Node & {
  __typename?: 'Interview';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  endedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  interviewee: Scalars['String'];
};

export type JoinInterviewInput = {
  interviewId: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createInterview: Interview;
  endInterview: Interview;
  joinInterview: Interview;
};


export type MutationCreateInterviewArgs = {
  input: CreateInterviewInput;
};


export type MutationEndInterviewArgs = {
  input: EndInterviewInput;
};


export type MutationJoinInterviewArgs = {
  input: JoinInterviewInput;
};

export type Node = {
  id: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  currentInterview?: Maybe<Interview>;
};

export type CreateInterviewMutationVariables = Exact<{
  input: CreateInterviewInput;
}>;


export type CreateInterviewMutation = { __typename?: 'Mutation', createInterview: { __typename?: 'Interview', id: string } };

export type CurrentInterviewQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentInterviewQuery = { __typename?: 'Query', currentInterview?: { __typename?: 'Interview', id: string } | null | undefined };

export type EndInterviewMutationVariables = Exact<{
  input: EndInterviewInput;
}>;


export type EndInterviewMutation = { __typename?: 'Mutation', endInterview: { __typename?: 'Interview', id: string, endedAt?: any | null | undefined } };

export type JoinInterviewMutationVariables = Exact<{
  input: JoinInterviewInput;
}>;


export type JoinInterviewMutation = { __typename?: 'Mutation', joinInterview: { __typename?: 'Interview', id: string } };


export const CreateInterviewDocument = gql`
    mutation CreateInterview($input: CreateInterviewInput!) {
  createInterview(input: $input) {
    id
  }
}
    `;
export type CreateInterviewMutationFn = Apollo.MutationFunction<CreateInterviewMutation, CreateInterviewMutationVariables>;

/**
 * __useCreateInterviewMutation__
 *
 * To run a mutation, you first call `useCreateInterviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInterviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInterviewMutation, { data, loading, error }] = useCreateInterviewMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateInterviewMutation(baseOptions?: Apollo.MutationHookOptions<CreateInterviewMutation, CreateInterviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInterviewMutation, CreateInterviewMutationVariables>(CreateInterviewDocument, options);
      }
export type CreateInterviewMutationHookResult = ReturnType<typeof useCreateInterviewMutation>;
export type CreateInterviewMutationResult = Apollo.MutationResult<CreateInterviewMutation>;
export type CreateInterviewMutationOptions = Apollo.BaseMutationOptions<CreateInterviewMutation, CreateInterviewMutationVariables>;
export const CurrentInterviewDocument = gql`
    query CurrentInterview {
  currentInterview {
    id
  }
}
    `;

/**
 * __useCurrentInterviewQuery__
 *
 * To run a query within a React component, call `useCurrentInterviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentInterviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentInterviewQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentInterviewQuery(baseOptions?: Apollo.QueryHookOptions<CurrentInterviewQuery, CurrentInterviewQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentInterviewQuery, CurrentInterviewQueryVariables>(CurrentInterviewDocument, options);
      }
export function useCurrentInterviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentInterviewQuery, CurrentInterviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentInterviewQuery, CurrentInterviewQueryVariables>(CurrentInterviewDocument, options);
        }
export type CurrentInterviewQueryHookResult = ReturnType<typeof useCurrentInterviewQuery>;
export type CurrentInterviewLazyQueryHookResult = ReturnType<typeof useCurrentInterviewLazyQuery>;
export type CurrentInterviewQueryResult = Apollo.QueryResult<CurrentInterviewQuery, CurrentInterviewQueryVariables>;
export const EndInterviewDocument = gql`
    mutation EndInterview($input: EndInterviewInput!) {
  endInterview(input: $input) {
    id
    endedAt
  }
}
    `;
export type EndInterviewMutationFn = Apollo.MutationFunction<EndInterviewMutation, EndInterviewMutationVariables>;

/**
 * __useEndInterviewMutation__
 *
 * To run a mutation, you first call `useEndInterviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEndInterviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [endInterviewMutation, { data, loading, error }] = useEndInterviewMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEndInterviewMutation(baseOptions?: Apollo.MutationHookOptions<EndInterviewMutation, EndInterviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EndInterviewMutation, EndInterviewMutationVariables>(EndInterviewDocument, options);
      }
export type EndInterviewMutationHookResult = ReturnType<typeof useEndInterviewMutation>;
export type EndInterviewMutationResult = Apollo.MutationResult<EndInterviewMutation>;
export type EndInterviewMutationOptions = Apollo.BaseMutationOptions<EndInterviewMutation, EndInterviewMutationVariables>;
export const JoinInterviewDocument = gql`
    mutation JoinInterview($input: JoinInterviewInput!) {
  joinInterview(input: $input) {
    id
  }
}
    `;
export type JoinInterviewMutationFn = Apollo.MutationFunction<JoinInterviewMutation, JoinInterviewMutationVariables>;

/**
 * __useJoinInterviewMutation__
 *
 * To run a mutation, you first call `useJoinInterviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinInterviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinInterviewMutation, { data, loading, error }] = useJoinInterviewMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useJoinInterviewMutation(baseOptions?: Apollo.MutationHookOptions<JoinInterviewMutation, JoinInterviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<JoinInterviewMutation, JoinInterviewMutationVariables>(JoinInterviewDocument, options);
      }
export type JoinInterviewMutationHookResult = ReturnType<typeof useJoinInterviewMutation>;
export type JoinInterviewMutationResult = Apollo.MutationResult<JoinInterviewMutation>;
export type JoinInterviewMutationOptions = Apollo.BaseMutationOptions<JoinInterviewMutation, JoinInterviewMutationVariables>;
export namespace CreateInterview {
  export type Variables = CreateInterviewMutationVariables;
  export type Mutation = CreateInterviewMutation;
  export type CreateInterview = (NonNullable<CreateInterviewMutation['createInterview']>);
  export const Document = CreateInterviewDocument;
  export const use = useCreateInterviewMutation;
}

export namespace CurrentInterview {
  export type Variables = CurrentInterviewQueryVariables;
  export type Query = CurrentInterviewQuery;
  export type CurrentInterview = (NonNullable<CurrentInterviewQuery['currentInterview']>);
  export const Document = CurrentInterviewDocument;
  export const use = useCurrentInterviewQuery;
}

export namespace EndInterview {
  export type Variables = EndInterviewMutationVariables;
  export type Mutation = EndInterviewMutation;
  export type EndInterview = (NonNullable<EndInterviewMutation['endInterview']>);
  export const Document = EndInterviewDocument;
  export const use = useEndInterviewMutation;
}

export namespace JoinInterview {
  export type Variables = JoinInterviewMutationVariables;
  export type Mutation = JoinInterviewMutation;
  export type JoinInterview = (NonNullable<JoinInterviewMutation['joinInterview']>);
  export const Document = JoinInterviewDocument;
  export const use = useJoinInterviewMutation;
}

export const ListAllOperations = {
  Query: {
    CurrentInterview: 'CurrentInterview' as const
  },
  Mutation: {
    CreateInterview: 'CreateInterview' as const,
    EndInterview: 'EndInterview' as const,
    JoinInterview: 'JoinInterview' as const
  }
}