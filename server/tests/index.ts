import { describe } from "node:test";
import { socketsTest } from "./sockets";
import { engineTest } from "./engine";

export const tests = describe('Tests',()=>{
  void Promise.allSettled([
    engineTest,socketsTest
  ])
})