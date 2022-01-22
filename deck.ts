import {
  bgBrightGreen,
  bgBrightWhite,
  black,
  bold,
} from "https://deno.land/std@0.122.0/fmt/colors.ts";
import { DrawableModel } from "./drawable.ts";

export class Card {
  constructor(public value: number) {}
}

export class DrawableCard extends Card implements DrawableModel {
  static get sprite() {
    const props = {
      card: "XX",
      slot: "--",
    };

    const model = [
      props.card,
    ].join("\n");

    return {
      props,
      model,
    };
  }

  sprite = DrawableCard.sprite;

  draw(
    options?: { highlightWinnerCard: boolean },
  ) {
    let cardDrawing = this.value.toString().padStart(2, "0");
    cardDrawing = black(bold(cardDrawing));

    if (options?.highlightWinnerCard) cardDrawing = bgBrightGreen(cardDrawing);
    else cardDrawing = bgBrightWhite(cardDrawing);

    const { props, model } = this.sprite;

    return model.replace(props.card, cardDrawing);
  }
}

export class Deck<CardType extends Card> {
  cards: CardType[];

  constructor(
    cardCreator: (value: number) => CardType = (value) =>
      new Card(value) as CardType,
  ) {
    this.cards = Array.from({ length: 52 })
      .map((_, i) => cardCreator(i + 1));
  }

  shuffle() {
    const deck = structuredClone(this.cards);
    this.cards = [];

    while (deck.length) {
      const index = Math.floor(Math.random() * deck.length);
      this.cards.push(...deck.splice(index, 1));
    }
  }

  *deal(playerCount = 2) {
    const dealerDeck: CardType[] = structuredClone(this.cards);
    const handSize = Math.floor(this.cards.length / playerCount);
    let playersDelt = 0;

    while (playersDelt < playerCount) {
      playersDelt++;
      yield dealerDeck.splice(0, handSize);
    }

    return dealerDeck.splice(0, handSize);
  }
}
