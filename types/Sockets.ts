import type { Phases } from "./Game";

export interface Server2ClientEvents {
  rooms: (rooms: Array<String>) => void;
  info: (data: string) => void;
  phaseChange: (phase: Phases) => void;
}

export type ResponseHandler = (message: string) => void;

export interface Client2ServerEvents {
  setPosition: (position: number, callback: ResponseHandler) => void;
  vote: (data: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
