import Game from "@/engine/Game";
import { PayloadError } from "@global/PayloadErrors";
import { Phases } from "@global/Phases";
import { ok, strictEqual, throws } from "node:assert";
import { describe, it } from "node:test";

export const baseEngineTest = describe("Game engine - basics", async () => {
  await it("should be able to create a new game", () => {
    const game = new Game();
  });

  await it("should be able to add a player", () => {
    const game = new Game();
    game._players.add("player1");

    strictEqual(game._players.all.length, 1);

    game._players.add("player2");

    strictEqual(game._players.all.length, 2);

    ok(game._players.has("player1"));
    ok(game._players.has("player2"));
  });

  await it("should be able to remove a player", () => {
    const game = new Game();
    game._players.add("player1");
    game._players.add("player2");
    game._players.remove("player1");

    strictEqual(game._players.all.length, 1);

    ok(!game._players.has("player1"));
    ok(game._players.has("player2"));
  });

  await it("should be able to assign a seat to a player", () => {
    const game = new Game();
    game._players.add("player2");
    game.seatAt("player2",0);
    ok(game._players.get("player2")?.seat == 0);
  });

  await it("should be able to assign a seat to multiple players", () => {
    const game = new Game();
    game._players.add("player1");
    game.seatAt("player1",0);
    game._players.add("player2");
    game._players.add("player3");
    game.seatAt("player3",1);
    game.seatAt("player2",0);
    ok(game._players.all);
  });

  await it("should be able to choose a persona", () => {
    const game = new Game();
    game._players.add("player2");
    game.describePlayer("player2",{description: "Player 2"}) // TODO
    ok(game._players.get("player2")?.persona );
  });

  await it("should be able to mark a player as ready if they have chosen a persona and a seat", () => {
    const game = new Game();
    game._players.add("player2");
    game.seatAt("player2",0);
    game.describePlayer("player2",{description: "Player 2"}) // TODO
    game.ready("player2", true);
    ok(game._players.get("player2")?.isReady);
  });

  await it("should not be able to mark a player as ready otherwise than after a persona and a seat have been chosen", () => {
    const game = new Game();
    game._players.add("player2"); 
    throws(
      ()=>{
        game.ready("player2", true);
      },
      new PayloadError("playerCannotBeReady")
    );
    ok(!game._players.get("player2")?.isReady);
  });

  await it("should be able to move to next phase if conditions are met", () => {
    const game = new Game();

    function join_to_ready(player: string){
      game.join(player);
      game.seatAt(player,0);
      game.describePlayer(player,{description: player}) // TODO
      game.ready(player, true);
    }

    join_to_ready("player2");
    strictEqual(game._phase.current, Phases.LOBBY);
    join_to_ready("player1");
    strictEqual(game._phase.current, Phases.LOBBY);
    join_to_ready("player3");
    strictEqual(game._phase.current, Phases.LOBBY);
    join_to_ready("player4");
    game.update();
    strictEqual(game._phase.current, Phases.ROLE_ASSIGNMENT);
  });
});
