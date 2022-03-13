import GMR from "graphql-merge-resolvers";
// const GMR = require("@wiicamp/graphql-merge-resolvers");

import resolversGenreMutation from "./genre";
import resolversUserMutation from "./user";

const mutationResolver = GMR.merge([
  resolversUserMutation,
  resolversGenreMutation,
]);

export default mutationResolver;
