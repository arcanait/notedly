const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

//Run the server on a port specified in our .env file or port 4000
const port = process.env.PORT || 4000;

// Simulate db
const notes = [
  {
    id: '1',
    content: 'This is a note',
    author: 'Adam Scott'
  },
  {
    id: '2',
    content: 'This is another note',
    author: 'Harlow Everly'
  },
  {
    id: '3',
    content: 'Oh hey look, another note!',
    author: 'Riley Harrison'
  }
];

// construct a schema, using GraphQL schema language.
const typeDefs = gql`
  type Pizza {
    id: ID!
    size: String!
    slices: Int!
    toppings: [String]
  }
  type Note {
    id: ID!
    content: String!
    author: String!
  }
  type Query {
    hello: String
    notes: [Note!]!
    note(id: ID!): Note!
  }
  type Mutation {
    newNote(content: String!): Note!
  }
`;

// Provide resolver functions for our schema fields.
// Two types of resolvers, queries and mutations.
// Queries: get data without transform it.
// Mutations: get data modified

// Apollo gift us 4 parameters to resolver functions:
// 1) parent: the result of the parent query, which is useful when nesting queries
// 2) args: these are the arguments passed by the user in the query
// 3) context: information passed along from the server application to the resolver functions. this could include
// things such as the current user or database information
// 4) info: Information about the query itself
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    notes: () => notes,
    note: (parent, args) => notes.find(note => note.id === args.id)
  },
  Mutation: {
    newNote: (parent, args) => {
      const noteValue = {
        id: String(notes.length + 1),
        content: args.content,
        author: 'Adam Scott'
      };
      notes.push(noteValue);
      return noteValue;
    }
  }
};

const app = express();

// Apollo server setup
const server = new ApolloServer({ typeDefs, resolvers });

// Apply the Apollo GraphQL middleware and set the path to /api.
server.applyMiddleware({ app, path: '/api' });

// app.get('/', (req, res) => res.send('Hello world!'));

app.listen(port, () =>
  console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
  )
);
