import { Db } from "mongodb";
import database from "./database";

//Obtener ID  que vamos a utilizar en el nuevo usuario
// database > Base de datos con la que estamos trabajando
// colletion > Colleccion donde queremos buscar el ultimo ejemplo
// sort > Como queremos ordenalo {<propiedad>: -1}

export const asignDocmentId = async (
  database: Db,
  collection: string,
  sort: object = { registerDate: -1 }
) => {
  const lastElement = await database
    .collection(collection)
    .find()
    .limit(1)
    .sort(sort)
    .toArray();

  if (lastElement.length === 0) {
    return "1";
  }
  return String(+lastElement[0].id + 1);
};

export const findOneElement = async (
  database: Db,
  collection: string,
  filter: object
) => {
  return database.collection(collection).findOne(filter);
};

export const insertOneElement = async (
  database: Db,
  collection: string,
  documento: object
) => {
  return await database.collection(collection).insertOne(documento);
};

export const insertManyElements = async (
  database: Db,
  collection: string,
  documento: Array<object>
) => {
  return await database.collection(collection).insertMany(documento);
};

export const updateOneElement = async (
  database: Db,
  collection: string,
  filter: object,
  updateObject: object
) => {
  return await database
    .collection(collection)
    .updateOne(filter, { $set: updateObject });
};

export const deleteOneElement = async (
  database: Db,
  collection: string,
  filter: object = {}
) => {
  return await database.collection(collection).deleteOne(filter);
};

export const findElements = async (
  database: Db,
  collection: string,
  filter: object = {}
) => {
  return await database.collection(collection).find(filter).toArray();
};
