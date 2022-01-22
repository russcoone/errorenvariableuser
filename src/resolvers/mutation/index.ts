import GMR from "graphql-merge-resolvers";
import resolversUserMutation from "./user";

const mutationResolver = GMR.merge([resolversUserMutation]);

export default mutationResolver;
