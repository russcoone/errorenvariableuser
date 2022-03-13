import { Db } from "mongodb";

export interface IContextDate {
  db?: Db;
  token?: string;
}
