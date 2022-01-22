import { Card, Deck, DrawableCard } from "./deck.ts";
import { Drawable } from "./drawable.ts";
import { DrawablePlayer, Player } from "./player.ts";

export class Game {
  static title = "DENO-UR-CARD";
  finished = false;

  players: Player[] = [];
  cardsPlayedPerRound: Card[][] = [];

  constructor(
    playerCount = 2,
    public PlayerType = Player,
    public CardType = Card,
  ) {
    if (playerCount > 52) {
      throw new Error("Maximum 52 players could play this game");
    }

    if (playerCount < 2) {
      throw new Error("You need at least 2 players to play this game");
    }

    const deck = new Deck(this.CardType);

    // I ALWAYS SHUFFLE TWICE IRL
    deck.shuffle();
    deck.shuffle();

    const dealer = deck.deal(playerCount);

    for (const hand of dealer) {
      this.players.push(new this.PlayerType(hand));
    }
  }

  /**
   * Play a card for each player and sets the highest card played as winner
   */
  round() {
    if (this.players.some((player) => player.handSize == 0)) {
      return this.finishGame();
    }

    const playedCards = this.players.map((player) => player.play()!);
    this.cardsPlayedPerRound.push(playedCards);

    const winnerCard = this.getWinnerCard(playedCards);

    this.players.forEach((player, i) => {
      if (i == winnerCard.i) player.handleVictory();
      else player.handleLoss();
    });
  }

  fastForward(cb: () => void) {
    setTimeout(() => {
      cb();
      this.round();
      if (!this.finished) this.fastForward(cb);
    }, 100);
  }

  getWinnerCard(cards: Card[]): { card: Card; i: number } {
    return cards.reduce((winner, card, i) => {
      if (card && card.value > winner.card.value) return { card, i };
      return winner;
    }, { i: -1, card: { value: 0 } });
  }

  finishGame() {
    this.finished = true;

    const winner = this.players.reduce((winner, { points }, i) => {
      if (points > winner.points) return { points, i: [i] };
      if (points == winner.points) winner.i.push(i);
      return winner;
    }, { i: [-1], points: 0 });

    this.players.forEach((player, i) => {
      if (winner.i.includes(i)) player.handleGameVictory();
      else player.handleGameLoss();
    });
  }
}

export class DrawableGame extends Game implements Drawable {
  declare players: DrawablePlayer[];
  declare cardsPlayedPerRound: DrawableCard[][];

  lineLength: number;
  playerSpacer = "  ";

  constructor(
    playerCount = 2,
    public PlayerType = DrawablePlayer,
    public CardType = DrawableCard,
  ) {
    super(playerCount, PlayerType, CardType);

    const playerSpacersTotalLength = (playerCount - 1) *
      this.playerSpacer.length;

    const playerSpotsTotalLength = playerCount *
      this.PlayerType.sprite.props.slot.length;

    this.lineLength = playerSpotsTotalLength + playerSpacersTotalLength;
  }

  static drawTitle(lineLength = 0) {
    const usableLength = lineLength > this.title.length
      ? lineLength
      : this.title.length;
    const padLength = Math.floor((usableLength - this.title.length) / 2);

    return [
      Array(usableLength).fill("-").join(""),
      Array(padLength).fill(" ").concat(this.title).join(""),
      Array(usableLength).fill("-").join(""),
    ].join("\n");
  }

  private drawTitle() {
    return DrawableGame.drawTitle(this.lineLength);
  }

  private drawPlayers() {
    const playerModels = this.players.map((player) => player.draw());
    const rows = this.PlayerType.sprite.model.split("\n");

    for (const row of rows.keys()) {
      rows[row] = playerModels.map(
        (p) => p.split("\n")[row],
      ).join(this.playerSpacer);
    }

    return rows.join("\n");
  }

  drawRound() {
    return [
      this.drawTitle(),
      "",
      this.drawPlayers(),
      "",
      `Cards left: ${this.players[0].handSize}`,
    ].join(
      "\n",
    );
  }

  drawEndGameResults() {
    return [
      this.drawTitle(),
      "",
      this.drawPlayers(),
      "",
      `Cards left: ${this.players[0].handSize}`,
    ].join(
      "\n",
    );
  }

  draw() {
    if (this.finished) return this.drawEndGameResults();
    return this.drawRound();
  }
}
