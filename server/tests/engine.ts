import { Game } from "@/engine/Game";
import { ok, strictEqual } from "node:assert";
import { describe, it } from "node:test";

describe("Game", async () => {
  let game: Game;

  await it("should be able to create a new game", () => {
    game = new Game();
  });

  await it("should be able to add a player", () => {
    game.players.add("player1");

    strictEqual(game.players.all.length, 1);

    game.players.add("player2");

    strictEqual(game.players.all.length, 2);

    ok(game.players.has("player1"));
    ok(game.players.has("player2"));
  });

  await it("should be able to remove a player", () => {
    game.players.remove("player1");

    strictEqual(game.players.all.length, 1);

    ok(!game.players.has("player1"));
    ok(game.players.has("player2"));
  });

  await it("should be able to mark a player as ready", () => {
    game.proccessReady("player2", true);
  });
});
