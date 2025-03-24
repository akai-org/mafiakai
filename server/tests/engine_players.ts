import Game from "@/engine/Game";
import { PayloadError } from "@global/PayloadErrors";
import { Phases } from "@global/Phases";
import { doesNotThrow, ok, strictEqual, throws } from "node:assert";
import { describe, it } from "node:test";

describe("Game engine - players", async () => {
  let game: Game;

  it("should be able to create a new game", () => {
    game = new Game();
  });

  it("should be able for players to join the game", () => {
    game.join("player1");
    game.join("player2");

    strictEqual(game._players.all.length, 2);

    ok(game._players.has("player1"));
    ok(game._players.has("player2"));
  });

  it("should throw an error when trying to join a player that is already in the game", () => {
    throws(() => game.join("player1"), new PayloadError("playerIsAlreadyConnected"));
  });

  it("should be able for players to leave the game", () => {
    game.leave("player1");
    game.leave("player2");

    strictEqual(game._players.all.length, 0);

    ok(!game._players.has("player1"));
    ok(!game._players.has("player2"));
  });

  it("when 4 players join and are ready, the game should move to the next phase", () => {
    game.join("player1");
    game.join("player2");
    game.join("player3");
    game.join("player4");
    game.ready("player1", true);
    game.ready("player2", true);
    game.ready("player3", true);

    strictEqual(game._phase.current, Phases.LOBBY);
    game.ready("player4", true);
    game.update();
    strictEqual(game._phase.current, Phases.ROLE_ASSIGNMENT);
  });

  it("should throw an error when trying to join a player that is not in the game", () => {
    throws(() => game.join("player5"), new PayloadError("gameAlreadyStarted"));
  });

  it("should be able to reconnect a player that left the game", () => {
    game.leave("player1");

    ok(!game._players.get("player1")?.online);

    doesNotThrow(() => game.join("player1"));

    ok(game._players.get("player1")?.online);
  });
});
