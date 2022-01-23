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

  fastForward(callback = () => {}) {
    setTimeout(() => {
      callback();

      if (!this.finished) {
        this.round();
        this.fastForward(callback);
      }
    }, 50);
  }

  getWinnerCard(cards: Card[]): { card: Card; i: number } {
    return cards.reduce((winner, card, i) => {
      if (card && card.value > winner.card.value) return { card, i };
      return winner;
    }, { i: -1, card: { value: 0 } });
  }

  getWinnersNames() {
    return this.players.map((player, i) => {
      if (player.winner) return `P${i + 1}`;
      return "";
    }).filter(Boolean);
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

  minLineLength = 24;

  get lineLength() {
    return this.minLineLength;
  }

  set lineLength(value: number) {
    this.minLineLength = Math.max(value, this.minLineLength);
  }

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
    const rowLength = Math.max(lineLength, new this().minLineLength);
    const padLength = Math.floor((rowLength - this.title.length) / 2);

    return [
      Array(rowLength).fill("-").join(""),
      Array(padLength).fill(" ").concat(this.title).join(""),
      Array(rowLength).fill("-").join(""),
      "",
    ].join("\n");
  }

  private drawTitle() {
    return DrawableGame.drawTitle(this.lineLength);
  }

  private calcPadLeft() {
    const rowWidth =
      Array.from(this.players).map((_) => this.PlayerType.sprite.props.slot)
        .join(this.playerSpacer).length;

    const padLength = Math.floor((this.lineLength - rowWidth) / 2);
    return Array(padLength).fill(" ").join("");
  }

  private drawPlayers() {
    const padLeft = this.calcPadLeft();
    const playerModels = this.players.map((player) => player.draw());
    const rows = this.PlayerType.sprite.model.split("\n");

    for (const row of rows.keys()) {
      rows[row] = padLeft + playerModels.map(
        (p) => p.split("\n")[row],
      ).join(this.playerSpacer);
    }

    return rows.join("\n");
  }

  private drawAllCardsPlayed() {
    return this.cardsPlayedPerRound.map((cardsPlayed) =>
      this.drawCardsPlayed(cardsPlayed, this.getWinnerCard(cardsPlayed).i)
    ).join("\n");
  }

  /**
   * @optionalParam cardsPlayed if none is specified will use last round's cards.
   * @optionalParam winnerIndex highlight card on index
   * @returns a card model for each player
   */
  private drawCardsPlayed(
    cardsPlayed = this.cardsPlayedPerRound[this.cardsPlayedPerRound.length - 1],
    winnerIndex = -1,
  ) {
    if (!cardsPlayed) return "";

    const playerLength = this.PlayerType.sprite.props.slot.length;
    const cardLength = this.CardType.sprite.props.slot.length;
    const padLength = Math.floor((playerLength - cardLength) / 2);
    const cardPadding = Array(padLength).fill(" ").join("");

    const cardModels = cardsPlayed.map((card, i) =>
      cardPadding +
      card.draw({ highlightWinnerCard: i == winnerIndex }) + cardPadding
    );

    const padLeft = this.calcPadLeft();

    return padLeft + cardModels.join(this.playerSpacer);
  }

  drawRound() {
    return [
      this.drawTitle(),
      this.drawPlayers(),
      "",
      this.drawCardsPlayed(),
      "",
      `Cards left: ${this.players[0].handSize}`,
    ].join(
      "\n",
    );
  }

  drawEndGameResults() {
    const winners = this.getWinnersNames();

    const gameResultMessage = winners.length == 1
      ? `${winners.pop()} WINS!`
      : `${winners.join(" ")} DRAW!`;

    return [
      this.drawTitle(),
      this.drawPlayers(),
      "",
      this.drawAllCardsPlayed(),
      "",
      gameResultMessage,
    ].join(
      "\n",
    );
  }

  draw() {
    if (this.finished) return this.drawEndGameResults();
    return this.drawRound();
  }
}
