export interface IContext {
  req: IRequest;
  connection: IConnection;
}

interface IRequest {
  headers: {
    authorization: String;
  };
}

interface IConnection {
  authorization: String;
}
