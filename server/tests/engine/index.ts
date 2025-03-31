import { describe } from "node:test";
import { baseEngineTest } from "./base";
import { playersEngineTest } from "./players";
import { votingEngineTest } from "./voting";

export const engineTest = describe('Engine tests',()=>{
  void Promise.allSettled([
    baseEngineTest,playersEngineTest,votingEngineTest
  ])
})