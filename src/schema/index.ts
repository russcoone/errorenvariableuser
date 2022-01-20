import "graphql-import-node";
import typeDefs from "./schema.graphql";
import { GraphQLSchema } from "graphql";
import resolvers from "../resolvers";
import { makeExecutableSchema } from "graphql-tools";

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
});

export default schema;
