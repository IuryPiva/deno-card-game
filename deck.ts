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
  private cards: CardType[];

  constructor(CardClass: new (value: number) => CardType) {
    this.cards = Array.from({ length: 52 })
      .map((_, i) => new CardClass(i + 1));
  }

  shuffle() {
    const deck: CardType[] = [];

    while (this.cards.length) {
      const index = Math.floor(Math.random() * this.cards.length);
      deck.push(...this.cards.splice(index, 1));
    }

    this.cards = deck;
  }

  *deal(playerCount = 2) {
    const handSize = Math.floor(this.cards.length / playerCount);
    let playersDelt = 0;

    while (playersDelt < playerCount) {
      playersDelt++;
      yield this.cards.splice(0, handSize);
    }

    return this.cards.splice(0, handSize);
  }
}
