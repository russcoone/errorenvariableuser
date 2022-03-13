import GMR from "graphql-merge-resolvers";
import resolversGenreQuery from "./genre";
import resolversProductQuery from "./product";
import resolversUserQuery from "./user";

const queryResolver = GMR.merge([
  resolversUserQuery,
  resolversProductQuery,
  resolversGenreQuery,
]);

export default queryResolver;
