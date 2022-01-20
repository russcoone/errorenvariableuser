import { IResolvers } from "graphql-tools";
import { COLLECTIONS } from "../config/constants";
import bcrypt from "bcrypt";

const resolversMutation: IResolvers = {
  Mutation: {
    async register(_, { user }, { db }) {
      // comprobar que el usuario no existe
      const userCheck = await db
        .collection(COLLECTIONS.USERS)
        .findOne({ email: user.email });
      if (userCheck !== null) {
        return {
          status: false,
          message: `El email ${user.email} esta registrdo y no puedes registrarte con este email`,
          user: null,
        };
      }

      //comprobar el ultimo usuario registrdo para asignar ID
      const lastUser = await db
        .collection(COLLECTIONS.USERS)
        .find()
        .limit(1)
        .sort({ registerDate: -1 })
        .toArray();

      if (lastUser.length === 0) {
        user.id = 1;
      } else {
        user.id = lastUser[0].id + 1;
      }

      //asignar la fecha en formato ISO en al propiedad redgister
      user.registerDate = new Date().toISOString();

      // Encriptar password
      user.password = bcrypt.hashSync(user.password, 10);

      // guaradr eñ documento (register) en al coleccion
      return await db
        .collection(COLLECTIONS.USERS)
        .insertOne(user)
        .then(async () => {
          return {
            status: true,
            message: `El usuario con el email ${user.email} esta registrdo correctamente`,
            user,
          };
        })
        .catch((err: Error) => {
          console.log(err.message);
          return {
            status: false,
            message: `Error inesperado prueba de nuevo`,
            user: null,
          };
        });
    },
  },
};

export default resolversMutation;
function err(err: any, Error: ErrorConstructor): any {
  throw new Error("Function not implemented.");
}
