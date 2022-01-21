import { deal, shuffle } from "./deck.ts";
import { Player } from "./player.ts";

export class Game {
  players: Player[];

  constructor(playerCount: number) {
    if (playerCount > 52) {
      throw new Error("Maximum 52 players could play this game");
    }

    if (playerCount < 2) {
      throw new Error("You need at least 2 players to play this game");
    }

    const deck = shuffle();
    const dealer = deal(deck, playerCount);

    this.players = Array.from(
      { length: playerCount },
      () => new Player(dealer.next().value),
    );
  }

  /**
   * Play a card for each player and sets the highest card played as winner
   */
  round() {
    if (this.players.some((player) => player.handSize == 0)) {
      throw new Error("A player is out of cards!");
    }

    const playedCards = this.players.map((player) => player.play());

    const winner = playedCards.reduce((winner, card, i) => {
      if (card && card.value > winner.card.value) return { card, i };
      return winner;
    }, { i: -1, card: { value: 0 } });

    this.players[winner.i].win();
  }
}
