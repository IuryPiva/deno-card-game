import {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.122.0/testing/asserts.ts";
import { DrawableGame, Game } from "./game.ts";

Deno.test("Game()", () => {
  Array.from({ length: 10 }, (_, i) => {
    const playerCount = i + 2;
    const game = new Game(playerCount);

    assertEquals(
      game.players.length,
      playerCount,
      "Should create the amount of players informed",
    );

    game.players.forEach((player) => {
      assert(
        player.handSize > 0,
        "Players should be dealt cards at the beginning of the game.",
      );
    });
  });

  assertThrows(
    () => new Game(1),
    Error,
    "You need at least 2 players to play this game",
  );

  assertThrows(
    () => new Game(53),
    Error,
    "Maximum 52 players could play this game",
  );
});

Deno.test("DrawableGame", () => {
  const baselineDrawTitle0 = `------------
DENO-UR-CARD
------------`;
  assertEquals(
    baselineDrawTitle0,
    DrawableGame.drawTitle(0),
  );

  const baselineDrawTitle30 = `------------------------------
         DENO-UR-CARD
------------------------------`;
  assertEquals(
    baselineDrawTitle30,
    DrawableGame.drawTitle(30),
  );

  const firstRoundBaseline = [
    "--------------",
    " DENO-UR-CARD",
    "--------------",
    "",
    "0️⃣ 0️⃣ 0️⃣   0️⃣ 0️⃣ 0️⃣ ",
    "              ",
    "  😊      😊  ",
    "",
    "Cards left: 26",
  ].join("\n");
  const game = new DrawableGame();
  assertEquals(firstRoundBaseline, game.draw());
});
