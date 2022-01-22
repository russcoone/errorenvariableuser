import { IResolvers } from "graphql-tools";
import { COLLECTIONS } from "../../config/constants";
import bcrypt from "bcrypt";
import {
  asignDocmentId,
  findOneElement,
  insertOneElement,
} from "../../lib/db-operations";

const resolversUserMutation: IResolvers = {
  Mutation: {
    async register(_, { user }, { db }) {
      // comprobar que el usuario no existe
      const userCheck = await findOneElement(db, COLLECTIONS.USERS, {
        email: user.email,
      });

      //{ email: user.email }
      if (userCheck !== null) {
        return {
          status: false,
          message: `El email ${user.email} esta registrdo y no puedes registrarte con este email`,
          user: null,
        };
      }

      //comprobar el ultimo usuario registrdo para asignar ID
      user.id = await asignDocmentId(db, COLLECTIONS.USERS, {
        registerDate: -1,
      });

      //asignar la fecha en formato ISO en al propiedad redgister
      user.registerDate = new Date().toISOString();

      // Encriptar password
      user.password = bcrypt.hashSync(user.password, 10);

      // guaradr eñ documento (register) en al coleccion
      return await insertOneElement(db, COLLECTIONS.USERS, user)
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

export default resolversUserMutation;
