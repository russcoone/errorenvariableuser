import { info } from "console";
import { IContextDate } from "./../interfaces/context-data.interface";
import {
  deleteOneElement,
  findElements,
  findOneElement,
  insertOneElement,
  updateOneElement,
} from "../lib/db-operations";
import { IVariables } from "../interfaces/variable.interface";
import { Db } from "mongodb";
import { pagination } from "../lib/pagination";

class ResolversOperationsService {
  private root: object;
  private variables: IVariables;
  private context: IContextDate;
  constructor(root: object, variables: IVariables, context: IContextDate) {
    this.root = root;
    this.variables = variables;
    this.context = context;
  }
  protected getContext(): IContextDate {
    return this.context;
  }

  protected getDb(): Db {
    return this.context.db!;
  }

  protected getVariables(): IVariables {
    return this.variables;
  }
  // Listar informacion
  protected async list(
    collection: string,
    listElement: string,
    page: number = 1,
    itemsPage: number = 20,
    filter: object = { active: { $ne: false } }
  ) {
    try {
      const paginationData = await pagination(
        this.getDb(),
        collection,
        page,
        itemsPage,
        filter
      );
      return {
        info: {
          page: paginationData.page,
          pages: paginationData.pages,
          itemsPage: paginationData.itemsPage,
          total: paginationData.total,
        },
        status: true,
        message: `Lista de ${listElement} correctamente cargada`,
        items: await findElements(
          this.getDb(),
          collection,
          filter,
          paginationData
        ),
      };
    } catch (error) {
      return {
        info: null,
        status: false,
        message: `Lista de ${listElement} no cargada: ${error}`,
        items: null,
      };
    }
  }

  // obtener detalles del Item
  protected async get(collection: string) {
    const collectionLabek = collection.toLowerCase();

    try {
      return await findOneElement(this.getDb(), collection, {
        id: this.variables.id,
      }).then((result) => {
        if (result) {
          return {
            status: true,
            message: `${collectionLabek} ha sido cargada correctamnete con sus detalles`,
            item: result,
          };
        }
        return {
          status: true,
          message: `${collectionLabek} no ha obtenio detalles por que no exixte`,
          item: null,
        };
      });
    } catch (error) {
      return {
        status: false,
        message: `Error inesperado al querer cargar los detalles de ${collectionLabek}`,
        item: null,
      };
    }
  }

  // Añadir Item

  protected async add(collection: string, document: object, item: string) {
    try {
      return await insertOneElement(this.getDb(), collection, document).then(
        (res) => {
          if (res.result.ok === 1) {
            return {
              status: true,
              message: `Añadido correctamente el ${item}`,
              item: document,
            };
          }

          return {
            status: false,
            message: `No se ha insertado el ${item}. Intentalo de nuevo porfavor`,
            item: null,
          };
        }
      );
    } catch (error) {
      return {
        status: false,
        message: `Error inesperado al inserta el ${item}. Intentalo de nuevo porfavor`,
        item: null,
      };
    }
  }

  // modificar Item
  protected async update(
    collection: string,
    filter: object,
    objectUpdate: object,
    item: string
  ) {
    try {
      return await updateOneElement(
        this.getDb(),
        collection,
        filter,
        objectUpdate
      ).then((res) => {
        if (res.result.nModified === 1 && res.result.ok) {
          return {
            status: true,
            message: `Elemento del ${item} actualizado correctamente.`,
            item: Object.assign({}, filter, objectUpdate),
          };
        }
        return {
          status: false,
          message: `Elemento del ${item} No se ha actualizado Comprueba que estas filtrando Correctamente o simplemente no ay nada que actualizar`,
          item: null,
        };
      });
    } catch (error) {
      return {
        status: false,
        message: `Error inesperado al actualizar el ${item}. Intentalo de nuevo porfavor`,
        item: null,
      };
    }
  }

  // eleiminar item
  protected async del(collection: string, filter: object, item: string) {
    try {
      return await deleteOneElement(this.getDb(), collection, filter).then(
        (res) => {
          if (res.deletedCount === 1) {
            return {
              status: true,
              message: `Elemento del ${item} borrado correctamente`,
            };
          }
          return {
            status: false,
            message: `Elemento del ${item} No se borrado compruebe el filtro`,
          };
        }
      );
    } catch (error) {
      return {
        status: false,
        message: `Error inesperado al eleiminar el ${item}. Intentalo de nuevo porfavor`,
      };
    }
  }
}

export default ResolversOperationsService;
