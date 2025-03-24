import Game from "@/engine/Game";
import { Phases } from "@global/Phases";
import { doesNotThrow, ok, strictEqual } from "assert";
import { describe, it } from "node:test";

describe("Game engine - players", async () => {
  let game: Game;

  await it("should be able to create a new game", () => {
    game = new Game();
  });

  await it("should be able to move to VOTING phase", () => {
    game.join("player1");
    game.ready("player1", true);
    game.join("player2");
    game.ready("player2", true);
    game.join("player3");
    game.ready("player3", true);
    game.join("player4");
    game.ready("player4", true);

    game.update();
    strictEqual(game._phase.current, Phases.ROLE_ASSIGNMENT);
    game.update();
    strictEqual(game._phase.current, Phases.WELCOME);
    game.update();
    strictEqual(game._phase.current, Phases.DEBATE);
    game.update();
    strictEqual(game._phase.current, Phases.VOTING);
  });

  await it("should be able to vote", () => {
    doesNotThrow(() => {
      game.vote("player1", "player2");
      game._timer.start(100, () => {});
    });
    strictEqual(game._players.get("player1")?.vote, "player2");
  });

  await it("should be able to change vote", () => {
    strictEqual(game._phase.current, Phases.VOTING);
    strictEqual(game._players.get("player1")?.vote, "player2");
    doesNotThrow(() => game.vote("player1", "player3"));
  });

  await it("should be able to vote for the same player", () => {
    doesNotThrow(() => game.vote("player1", "player3"));
    doesNotThrow(() => game.vote("player2", "player3"));
  });

  await it("should not be able to end voting, without all votes", () => {
    strictEqual(game._phase.current, Phases.VOTING);
    game.update();
    strictEqual(game._phase.current, Phases.VOTING);
  });

  await it("should be able to end voting, with all votes (player3 death)", () => {
    game.vote("player3", "player4");
    game.vote("player4", "player3");
    game.update();
    strictEqual(game._phase.current, Phases.ROLE_REVEAL);
    strictEqual(game._players.get("player3")?.alive, false);
  });
});
