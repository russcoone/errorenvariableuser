import { COLLECTIONS, EXPIRETIME, MESSAGES } from "../config/constants";
import { IContextDate } from "../interfaces/context-data.interface";
import { asignDocmentId, findOneElement } from "../lib/db-operations";
import ResolversOperationsService from "./resolvers-operations.service";
import JWT from "../lib/jwt";
import bcrypt from "bcrypt";

class UsersService extends ResolversOperationsService {
  private collection = COLLECTIONS.USERS;
  constructor(root: object, variables: object, context: IContextDate) {
    super(root, variables, context);
  }

  // lista de usuarios
  async items() {
    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;

    const result = await this.list(
      this.collection,
      "usuarios",
      page,
      itemsPage
    );
    return {
      info: result.info,
      status: result.status,
      message: result.message,
      users: result.items,
    };
  }

  // Auntentication
  async auth() {
    let info = new JWT().verify(this.getContext().token!);
    if (info === MESSAGES.TOKEN_VERICATION_FAILED) {
      return {
        status: false,
        message: info,
        user: null,
      };
    }
    return {
      status: true,
      message: "Usuario authenticado mediante el token",
      user: Object.values(info)[0],
    };
  }

  //iniciar sesion
  async login() {
    try {
      const variables = this.getVariables().user;
      const user = await findOneElement(this.getDb(), this.collection, {
        email: variables?.email,
      });

      if (user === null) {
        return {
          status: false,
          message: "Usuario no exite",
          token: null,
        };
      }

      const passwordCheck = bcrypt.compareSync(
        variables?.password || "",
        user.password || ""
      );

      if (passwordCheck !== null) {
        delete user.password;
        delete user.birthday;
        delete user.registerDate;
      }

      return {
        status: passwordCheck,
        message: !passwordCheck
          ? "Password y usuario no correctos, sesion no iniciada"
          : " Usuario cargado Correctamenta",
        token: !passwordCheck ? null : new JWT().sign({ user }, EXPIRETIME.H24),
        user: !passwordCheck ? null : user,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message:
          "Error al cargar el usuario . Comprobar que tienes correctamente todo",
        token: null,
      };
    }
  }

  //registrar un usuario
  async register() {
    const user = this.getVariables().user;
    if (user === null) {
      return {
        status: false,
        message: "Usuario no definido procura definirlo",
        user: null,
      };
    }
    if (
      user?.password === null ||
      user?.password === undefined ||
      user?.password === ""
    ) {
      return {
        status: false,
        message: "Usuario sin passsword correcto",
        user: null,
      };
    }

    // comprobar que el usuario no existe
    const userCheck = await findOneElement(this.getDb(), this.collection, {
      email: user?.email,
    });

    //{ email: user.email }
    if (userCheck !== null) {
      return {
        status: false,
        message: `El email ${user?.email} esta registrdo y no puedes registrarte con este email`,
        user: null,
      };
    }

    //comprobar el ultimo usuario registrdo para asignar ID
    user!.id = await asignDocmentId(this.getDb(), this.collection, {
      registerDate: -1,
    });

    //asignar la fecha en formato ISO en al propiedad redgister
    user!.registerDate = new Date().toISOString();

    // Encriptar password
    user!.password = bcrypt.hashSync(user!.password, 10);

    // guaradr eñ documento (register) en al coleccion
    const result = await this.add(this.collection, user || {}, "usuario");
    return {
      status: result.status,
      message: result.message,
      user: result.item,
    };
  }
  //modificar un usuarios
  async modify() {
    const user = this.getVariables().user;
    // comprobar que user no es null
    if (user === null) {
      return {
        status: false,
        message: "Usuario actualizado",
        user: null,
      };
    }
    const filter = { id: user?.id };
    const result = await this.update(
      this.collection,
      filter,
      user || {},
      "usuario"
    );
    return {
      status: result.status,
      message: result.message,
      user: result.item,
    };
  }
  //Borrar el usuario selecionado
  async delete() {
    const id = this.getVariables().id;
    if (id === undefined || id === "") {
      return {
        status: false,
        message:
          "Identificador del usuario no definido procure definirlo para eliminar el useario",
        user: null,
      };
    }
    const result = await this.del(this.collection, { id }, "usuario");
    return {
      status: result.status,
      message: result.message,
    };
  }
}

export default UsersService;
