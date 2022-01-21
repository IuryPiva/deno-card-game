import {
  assert,
  assertArrayIncludes,
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.122.0/testing/asserts.ts";
import { deal, newCard, newDeck, shuffle } from "./deck.ts";

Deno.test("newCard()", () => {
  Array(52).forEach((_, i) => {
    const card = newCard(undefined, i);
    assertEquals(card.value, i + 1, "Cards value should be index + 1");
  });
});

Deno.test("newDeck()", () => {
  const deck = newDeck();
  assertEquals(deck.length, 52, "Deck should contain 52 cards");

  for (const card of deck) {
    assert(
      card.value > 0 && card.value < 53,
      "Deck should contain cards between 1 and 52, included",
    );
  }
});

Deno.test("shuffle()", () => {
  const deck = newDeck();
  const shuffled = shuffle();

  assertArrayIncludes(
    shuffled,
    deck,
    "shuffled deck should include all possible cards",
  );

  assertNotEquals(
    shuffle(),
    shuffle(),
    "shuffled deck should be diffent on each call",
  );
});

Deno.test("deal()", () => {
  const shuffled = shuffle();

  for (let i = 1; i <= shuffled.length; i++) {
    const dealer = deal(shuffled, i);
    const expectedHandSize = Math.floor(shuffled.length / i);

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
