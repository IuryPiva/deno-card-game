export type Card = { value: number };

export const newCard = (_: unknown, i: number) => ({ value: i + 1 }) as Card;
export const newDeck = () => Array.from({ length: 52 }, newCard);

export function shuffle(): Card[] {
  const deck = newDeck();
  const shuffled: Card[] = [];

  while (deck.length) {
    const index = Math.floor(Math.random() * deck.length);
    shuffled.push(...deck.splice(index, 1));
  }

  return shuffled;
}

export function* deal(deck: Card[], playerCount = 2) {
  const dealerDeck: Card[] = structuredClone(deck);
  const handSize = Math.floor(deck.length / playerCount);
  let playersDelt = 0;

  while (playersDelt < playerCount) {
    playersDelt++;
    yield dealerDeck.splice(0, handSize);
  }

  return dealerDeck.splice(0, handSize);
}
