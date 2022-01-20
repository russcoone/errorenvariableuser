import { EXPIRETIME } from "./../config/constants";
import { MESSAGES, SECRET_KEY } from "../config/constants";
import jwt from "jsonwebtoken";
import { IJwt } from "../interfaces/jwt.interface";

class JWT {
  private secretKey = SECRET_KEY as string;
  //24 horas de caducidad
  sign(data: IJwt, expiresIn: number = EXPIRETIME.H24) {
    return jwt.sign({ user: data.user }, this.secretKey, {
      expiresIn,
    });
  }
  verify(token: string) {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (e) {
      return MESSAGES.TOKEN_VERICATION_FAILED;
    }
  }
}

export default JWT;
