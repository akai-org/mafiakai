export interface Server2ClientEvents {
  info: (data: string) => void;
}

export interface Client2ServerEvents {
  vote: (data: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
