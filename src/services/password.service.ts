import { COLLECTIONS, EXPIRETIME } from "../config/constants";
import { IContextDate } from "../interfaces/context-data.interface";
import { findOneElement } from "../lib/db-operations";
import JWT from "../lib/jwt";
import MailService from "./mail.service";
import ResolversOperationsService from "./resolvers-operations.service";
import bcrypt from "bcrypt";

class PasswordService extends ResolversOperationsService {
  constructor(root: object, variables: object, context: IContextDate) {
    super(root, variables, context);
  }
  async senMail() {
    const email = this.getVariables().user?.email || "";
    if (email === undefined || email === "") {
      return {
        status: false,
        message: "El email no se ha definido correctamente",
      };
    }
    //Coger informacion del usuarios
    const user = await findOneElement(this.getDb(), COLLECTIONS.USERS, {
      email,
    });
    console.log(user);
    //Si usuario es indifinido mandamos un mensaje que no exixte el usuario
    if (user === undefined || user === null) {
      return {
        status: false,
        message: `Usuario con el email ${email} no existe`,
      };
    }
    const newUser = {
      id: user.id,
      email,
    };
    const token = new JWT().sign({ user: newUser }, EXPIRETIME.M15);
    const html = `Para cambiar de contraseña haz click sobre este enlace: <a href="${process.env.CLIENT_URL}/#/reset/${token}">Clic aqui</a>`;
    const mail = {
      to: email,
      subject: "Peticion para cambiar de contraseña",
      html,
    };
    return new MailService().send(mail);
  }
  async change() {
    const id = this.getVariables().user?.id;
    let password = this.getVariables().user?.password;

    //comprovar que el id es correcto: no indefinido y no blanco
    if (id === undefined || id === "") {
      return {
        status: false,
        message: "El ID necesita una informacion correctamente",
      };
    }
    // comprobar que el password es correcto: no indefinido y no en blanco
    if (password === undefined || password === "" || password === "1234") {
      return {
        status: false,
        message: "El Password necesita una informacion correctamente",
      };
    }
    // Encriptar el password
    password = bcrypt.hashSync(password, 10);
    // Acualizar en el id selecionado de la coleccion usuarios
    const result = await this.update(
      COLLECTIONS.USERS,
      { id },
      { password },
      "users"
    );
    return {
      status: result.status,
      message: result.status
        ? "Contraseña cambiada correctamnete"
        : result.message,
    };
  }
}

export default PasswordService;
