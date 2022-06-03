import GMR from "graphql-merge-resolvers";
import resolversMailMutation from "./email";
// const GMR = require("@wiicamp/graphql-merge-resolvers");

import resolversGenreMutation from "./genre";
import resolversUserMutation from "./user";

const mutationResolver = GMR.merge([
  resolversUserMutation,
  resolversGenreMutation,
  resolversMailMutation,
]);

export default mutationResolver;
