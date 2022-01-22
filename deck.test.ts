import {
  assert,
  assertArrayIncludes,
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.122.0/testing/asserts.ts";
import { Card, Deck } from "./deck.ts";

Deno.test("Card", () => {
  Array.from({ length: 52 }).forEach((_, i) => {
    const card = new Card(i + 1);
    assertEquals(card.value, i + 1, "Cards should hold their values");
  });
});

Deno.test("Deck", () => {
  const deck = new Deck();

  assertEquals(deck.cards.length, 52, "Deck should contain 52 cards");

  const possibleCards = Array.from({ length: 52 }).map((_, i) => i + 1);

  assertArrayIncludes(
    deck.cards.map((c) => c.value),
    possibleCards,
    "Deck should have all 52 different cards.",
  );

  const hand = deck.deal(1).next().value;
  deck.shuffle();

  assertEquals(
    deck.cards.length,
    52,
    "Deck should contain 52 cards after shuffle.",
  );

  assertArrayIncludes(
    deck.cards.map((c) => c.value),
    possibleCards,
    "Deck should have all 52 different cards after shuffling.",
  );

  assertNotEquals(
    hand,
    deck.deal(1).next().value,
    "Cards should be different after shuffling.",
  );


  for (let i = 1; i <= possibleCards.length; i++) {
    const dealer = deck.deal(i);
    const expectedHandSize = Math.floor(possibleCards.length / i);
    let playersDelt = 0;

    for (const playerHand of dealer) {
      playersDelt++;

      assertEquals(
        playerHand.length,
        expectedHandSize,
        "Players should be dealt the same amount of cards",
      );
    }

    assertEquals(playersDelt, i, "Should create a hand for each player");
  }
});

