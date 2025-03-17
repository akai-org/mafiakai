import Game from "@/engine/Game";
import { Phases } from "@global/Phases";
import { ok, strictEqual } from "node:assert";
import { describe, it } from "node:test";

describe("Game engine - basics", async () => {
  let game: Game;

  await it("should be able to create a new game", () => {
    game = new Game();
  });

  await it("should be able to add a player", () => {
    game._players.add("player1");

    strictEqual(game._players.all.length, 1);

    game._players.add("player2");

    strictEqual(game._players.all.length, 2);

    ok(game._players.has("player1"));
    ok(game._players.has("player2"));
  });

  await it("should be able to remove a player", () => {
    game._players.remove("player1");

    strictEqual(game._players.all.length, 1);

    ok(!game._players.has("player1"));
    ok(game._players.has("player2"));
  });

  await it("should be able to mark a player as ready", () => {
    game.ready("player2", true);

    ok(game._players.get("player2")?.isReady);
  });

  await it("should be able to move to next phase if conditions are met", () => {
    game.join("player1");
    game.join("player3");
    game.join("player4");

    strictEqual(game._phase.current, Phases.LOBBY);
    game.ready("player1", true);
    strictEqual(game._phase.current, Phases.LOBBY);
    game.ready("player3", true);
    strictEqual(game._phase.current, Phases.LOBBY);
    game.ready("player4", true);
    game.update();
    strictEqual(game._phase.current, Phases.ROLE_ASSIGNMENT);
  });
});
