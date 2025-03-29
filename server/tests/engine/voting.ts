import Game from "@/engine/Game";
import { Phases } from "@global/Phases";
import { doesNotThrow, ok, strictEqual } from "assert";
import { describe, it } from "node:test";

export const votingEngineTest = describe("Game engine - voting", async () => {
  await it("should be able to create a new game", () => {
    const game = new Game();
  });

  function gameReady(): Game{
    const game = new Game();
    function join_to_ready(player: string){
      game.join(player);
      game.seatAt(player,0);
      game.describePlayer(player,{description: player}) // TODO
      game.ready(player, true);
    } 

    for (let i of [1,2,3,4]){
      join_to_ready(`player${i}`)
    }
    return game;
  }

  await it("should be able to move to VOTING phase", () => {
    const game = gameReady();

    game.update();
    strictEqual(game._phase.current, Phases.ROLE_ASSIGNMENT);
    game.update();
    strictEqual(game._phase.current, Phases.WELCOME);
    game.update();
    strictEqual(game._phase.current, Phases.DEBATE);
    game.update();
    strictEqual(game._phase.current, Phases.VOTING);
  });

  function GameVote(): Game{
    const game = gameReady();
    game.update();
    game.update();
    game.update();
    game.update();
    return game;
  }

  await it("should be able to vote", () => {
    const game = GameVote();
    strictEqual(game._phase.current, Phases.VOTING);

    doesNotThrow(() => {
      game.vote("player1", "player2");
      game._timer.start(100, () => {});
    });
    strictEqual(game._players.get("player1")?.vote, "player2");
  });

  await it("should be able to change vote", () => {
    const game = GameVote();
    strictEqual(game._phase.current, Phases.VOTING);

    game.vote("player1", "player2");
    
    strictEqual(game._players.get("player1")?.vote, "player2");
    doesNotThrow(() => game.vote("player1", "player3"));
  });

  await it("should be able to vote for the same player", () => {
    const game = GameVote();
    strictEqual(game._phase.current, Phases.VOTING);
    doesNotThrow(() => game.vote("player1", "player3"));
    doesNotThrow(() => game.vote("player2", "player3"));
  });

  await it("should not be able to end voting, without all votes", () => {
    const game = GameVote();
    strictEqual(game._phase.current, Phases.VOTING);
    game.vote("player1", "player3");
    game.vote("player2", "player3");
    strictEqual(game._phase.current, Phases.VOTING);
    game.update();
    strictEqual(game._phase.current, Phases.VOTING);
  });

  await it("should be able to end voting, with all votes (player3 death)", () => {
    const game = GameVote();
    strictEqual(game._phase.current, Phases.VOTING);
    game.vote("player1", "player3");
    game.vote("player2", "player3");
    game.update();
    strictEqual(game._phase.current, Phases.VOTING);
    game.vote("player3", "player4");
    game.vote("player4", "player3");
    game.update();
    strictEqual(game._phase.current, Phases.ROLE_REVEAL);
    strictEqual(game._players.get("player3")?.alive, false);
  });
});
