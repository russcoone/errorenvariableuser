import GMR from "graphql-merge-resolvers";
import resolversProductQuery from "./product";
import resolversUserQuery from "./user";

const queryResolver = GMR.merge([resolversUserQuery, resolversProductQuery]);

export default queryResolver;
