import {
  assert,
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.122.0/testing/asserts.ts";
import { Deck } from "./deck.ts";
import { Player } from "./player.ts";

Deno.test("Player", () => {
  const deck = new Deck();
  const player = new Player(deck.deal(1).next().value);

  assertEquals(player.points, 0, "Players should start with 0 points");

  assertEquals(
    deck.cards.map(v => v.value),
    player.showHand().map(v => v.value),
    "Players should keep the hands they are dealt",
  );

  const cardOnTop = deck.cards.pop();
  const playedCard = player.play();

  assertExists(playedCard, "Players should play a card when they have cards.");
  assertEquals(playedCard.value, cardOnTop?.value, "Players should play the card on top");

  const emptyHandedPlayer = new Player([]);
  const emptyCard = emptyHandedPlayer.play();

  assertEquals(
    emptyCard,
    undefined,
    "Players should play an undefined card when they are out of cards.",
  );
  const previousScore = player.points;

  player.handleVictory();

  assert(
    player.points > previousScore,
    "Players should score a point on wins.",
  );
});
