import {
  assert,
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.122.0/testing/asserts.ts";
import { newDeck } from "./deck.ts";
import { Player } from "./player.ts";

Deno.test("Player.constructor()", () => {
  const deck = newDeck();
  const player = new Player(deck);

  assertEquals(player.points, 0, "Players should start with 0 points");

  assertEquals(
    deck,
    player.showHand(),
    "Players should keep the hands they are dealt",
  );
});

Deno.test("Player.play()", () => {
  const deck = newDeck();
  const cardOnTop = deck[deck.length - 1];
  const player = new Player(deck);
  const playedCard = player.play();

  assertExists(playedCard, "Players should play a card when they have cards.");
  assertEquals(playedCard, cardOnTop, "Players should play the card on top");

  const emptyHandedPlayer = new Player([]);
  const emptyCard = emptyHandedPlayer.play();

  assertEquals(
    emptyCard,
    undefined,
    "Players should play an undefined card when they are out of cards.",
  );
});

Deno.test("Player.win()", () => {
  const player = new Player([]);
  const previousScore = player.points;

  player.win();
  assert(
    player.points > previousScore,
    "Players should score a point on wins.",
  );
});
