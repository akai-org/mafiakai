import { Game } from "@/engine/Game";
import { ok, strictEqual } from "node:assert";
import { describe, it } from "node:test";

describe("Game", async () => {
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
  });
});
