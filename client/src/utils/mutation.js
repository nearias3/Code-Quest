import { gql } from '@apollo/client';

export const ADD_ITEM = gql`
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

export const ADD_ENEMY = gql`
  mutation addEnemy($name: String!, $desc: String) {
    addEnemy(name: $name, desc: $desc) {
      enemy {
        _id
        name
        desc
      }
    }
  }
`;
