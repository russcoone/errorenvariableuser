import environment from "./environments";

if (process.env.NODE_ENV !== "production") {
  const env = environment;
}

export const SECRET_KEY = process.env.SECRET || "App OnlineStore";

export enum COLLECTIONS {
  USERS = "users",
  GENRES = "genres",
}

export enum MESSAGES {
  TOKEN_VERICATION_FAILED = "token no valido inicia secion de nuevo",
}

// H = horas
// M = Minutos
// D = DIas

export enum EXPIRETIME {
  H1 = 60 * 60,
  H24 = 24 * H1,
  M15 = H1 / 4,
  M20 = H1 / 3,
  D3 = H24 * 3,
}

export enum ACTIVE_VALUE_FILTER {
  ALL = "ALL",
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
}
