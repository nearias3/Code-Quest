import { gql } from "@apollo/client";

// Query to fetch user progress
export const GET_USER_PROGRESS = gql`
  query getUserProgress {
    me {
      progress
    }
  }
`;
