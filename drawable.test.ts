import { assertEquals } from "https://deno.land/std@0.122.0/testing/asserts.ts";
import { DrawableGame } from "./game.ts";

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
