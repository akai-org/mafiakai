export interface Server2ClientEvents {
  rooms: (rooms: Array<String>) => void;
  info: (data: string) => void;
}

export type ResponseHandler = (message: string) => void;

export interface Client2ServerEvents {
  createRoom: (callback: ResponseHandler) => void;
  joinRoom: (code: string, position: number, callback: ResponseHandler) => void;
  vote: (data: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
