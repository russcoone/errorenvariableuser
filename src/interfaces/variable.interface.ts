import { IPaginationOptions } from "./pagination-opcions.interface";
import { IUser } from "./user.interface";

export interface IVariables {
  id?: String | number;
  genre?: string;
  user?: IUser;
  pagination?: IPaginationOptions;
}
