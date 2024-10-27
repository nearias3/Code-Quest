import { gql } from "@apollo/client";

// Query to fetch user progress
export const GET_USER_PROGRESS = gql`
  query getUserProgress {
    me {
      progress
    }
  }
`;

export const QUERY_ENEMIES = gql`
  query allEnemies {
    enemies {
        _id
        name
        desc
    }
  }
`;

export const QUERY_SINGLE_ENEMY = gql`
  query singleEnemy($name: String!, $desc: String) {
    enemy(name: $name, desc: $desc) {
      enemy {
        _id
        name
        desc
      }
    }
  }
`;

export const QUERY_ITEMS= gql`
  mutation addItem($name: String!, $desc: String) {
    addItem(name: $name, desc: $desc) {
      item {
        _id
        name
        desc
      }
    }
  }
`;

export const QUERY_SINGLE_ITEM = gql`
  query singleItem($name: String!, $desc: String) {
    item(name: $name, desc: $desc) {
      item {
        _id
        name
        desc
      }
    }
  }
`;