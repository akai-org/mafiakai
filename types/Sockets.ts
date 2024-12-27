export interface Server2ClientEvents {
  info: (data: string) => void;
}

export interface Client2ServerEvents {
  joinRoom: (code: string) => void;
  vote: (data: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
