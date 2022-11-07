const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Word {
        name: String
    }

    type User {
        _id: ID
        username: String
        email: String
        password: String
        wins: Int
        losses: Int
        team: Team
        isSpyMaster: Boolean
    }

    type Team {
        _id: ID
        isTeamDog: Boolean
        users: [User]
        words: [Word]
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        user(userId: ID!): User
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
    }

`;

module.exports = typeDefs;