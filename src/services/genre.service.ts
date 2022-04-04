import { filter } from "compression";
import slugify from "slugify";
import { COLLECTIONS } from "../config/constants";
import { IContextDate } from "../interfaces/context-data.interface";
import { asignDocmentId, findOneElement } from "../lib/db-operations";
import ResolversOperationsService from "./resolvers-operations.service";

class GenresService extends ResolversOperationsService {
  collection = COLLECTIONS.GENRES;
  constructor(root: object, variables: object, context: IContextDate) {
    super(root, variables, context);
  }
  async items() {
    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;
    const result = await this.list(this.collection, "generos", page, itemsPage);
    return {
      info: result.info,
      status: result.status,
      message: result.message,
      genres: result.items,
    };
  }
  async details() {
    const result = await this.get(this.collection);
    return {
      status: result.status,
      message: result.message,
      genre: result.item,
    };
  }
  async insert() {
    const genre = this.getVariables().genre;
    // Comprobar que no esta en blanco ni es indefinido
    if (!this.checkData(genre || "")) {
      return {
        status: false,
        message: "El genero no se ha especificado correctamente",
        genre: null,
      };
    }
    //Comprobar que no existe
    if (await this.checkInDatabase(genre || "")) {
      return {
        status: false,
        message: "El genero existe en la base de datos intenta con otro genero",
        genre: null,
      };
    }

    // si valida las opciones anteriores venir aqui el docment
    const genreObject = {
      id: await asignDocmentId(this.getDb(), this.collection, { id: -1 }),
      name: genre,
      slug: slugify(genre || "", { lower: true }),
    };
    const result = await this.add(
      this.collection,
      genreObject,

      "genero"
    );
    return {
      status: result.status,
      message: result.message,
      genre: result.item,
    };
  }

  async modify() {
    const id = this.getVariables().id;
    const genre = this.getVariables().genre;
    //comprobar que le id es correctos
    if (!this.checkData(String(id) || "")) {
      return {
        status: false,
        message: `El ID del genero no se ha especificado correctamente`,
        genre: null,
      };
    }

    if (!this.checkData(genre || "")) {
      return {
        status: false,
        message: "El genero no se ha especificado correctamente",
        genre: null,
      };
    }

    const objectUpdate = {
      name: genre,
      slug: slugify(genre || "", { lower: true }),
    };

    // comprobamos que el genero es correcto

    const result = await this.update(
      this.collection,
      { id },
      objectUpdate,
      "genero"
    );
    return {
      status: result.status,
      message: result.message,
      genre: result.item,
    };
  }

  async delete() {
    const id = this.getVariables().id;
    //comprobar que le id es correctos
    if (!this.checkData(String(id) || "")) {
      return {
        status: false,
        message: `El ID del genero no se ha especificado correctamente`,
        genre: null,
      };
    }
    const result = await this.del(this.collection, { id }, "genero");
    return { status: result.status, message: result.message };
  }

  private checkData(value: string) {
    return value === "" || value === undefined ? false : true;
  }
  private async checkInDatabase(value: string) {
    return await findOneElement(this.getDb(), this.collection, {
      name: value,
    });
  }
}

export default GenresService;
