import Game from "@/engine/Game";
import { PayloadError } from "@global/PayloadErrors";
import { Phases } from "@global/Phases";
import { doesNotThrow, ok, strictEqual, throws } from "node:assert";
import { describe, it } from "node:test";

export const playersEngineTest = describe("Game engine - players", async () => {
  it("should be able to create a new game", () => {
    const game: Game = new Game();
  });

  it("should be able for players to join the game", () => {
    const game: Game = new Game();
    game.join("player1");
    game.join("player2");

    strictEqual(game._players.all.length, 2);

    ok(game._players.has("player1"));
    ok(game._players.has("player2"));
  });

  it("should throw an error when trying to join a player that is already in the game", () => {
    const game: Game = new Game();
    game.join("player1");
    throws(() => game.join("player1"), new PayloadError("playerIsAlreadyConnected"));
  });

  it("should be able for players to leave the game", () => {
    const game: Game = new Game();
    game.join("player1");
    game.join("player2");
    game.leave("player1");
    game.leave("player2");

    strictEqual(game._players.all.length, 0);

    ok(!game._players.has("player1"));
    ok(!game._players.has("player2"));
  });

  it("when 4 players join and are ready, the game should move to the next phase", () => {
    const game: Game = new Game();

    function join_to_ready(player: string){
      game.join(player);
      game.seatAt(player,0);
      game.describePlayer(player,{description: player}) // TODO
      game.ready(player, true);
    }

    for (let i of [1,2,3]){
      join_to_ready(`player${i}`)
    }

    strictEqual(game._phase.current, Phases.LOBBY);
    join_to_ready(`player4`)
    game.update();
    strictEqual(game._phase.current, Phases.ROLE_ASSIGNMENT);
  });

  it("should throw an error when joining a player after the game has started", () => {
    const game: Game = new Game();

    function join_to_ready(player: string){
      game.join(player);
      game.seatAt(player,0);
      game.describePlayer(player,{description: player}) // TODO
      game.ready(player, true);
    }

    for (let i of [1,2,3,4]){
      join_to_ready(`player${i}`)
    }
    game.update();
    throws(() => game.join("player5"), new PayloadError("gameAlreadyStarted"));
  });

  it("should be able to reconnect a player that left the game", () => {
    const game: Game = new Game();

    function join_to_ready(player: string){
      game.join(player);
      game.seatAt(player,0);
      game.describePlayer(player,{description: player}) // TODO
      game.ready(player, true);
    }

    for (let i of [1,2,3,4]){
      join_to_ready(`player${i}`)
    }
    game.update();
    strictEqual(game._phase.current, Phases.ROLE_ASSIGNMENT)
    game.leave("player1");

    ok(!game._players.get("player1")?.online);

    doesNotThrow(() => game.join("player1"));

    ok(game._players.get("player1")?.online);
  });
});
