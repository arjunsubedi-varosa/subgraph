import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';
import { buildSubgraphSchema } from '@apollo/subgraph';

const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable"])

  type Query {
    auth: Users
  }

  type Users @key(fields: "id") {
    id: ID!
    username: String
  }
`;

const resolvers = {
  Query: {
    auth() {
      return { id: '1', username: '@ava' };
    },
  },
  User: {
    __resolveReference(user: any, { fetchUserById }: {fetchUserById: any}) {
      return fetchUserById(user.id);
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

const start = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 7001 }
  });
  console.log(`🚀  Server ready at ${url}`);
}

start();