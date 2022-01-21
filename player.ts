import { Card } from "./deck.ts";

export class Player {
  points = 0;

  constructor(private hand: Card[]) {}

  showHand(): typeof this.hand {
    return structuredClone(this.hand);
  }

  play() {
    return this.hand.pop();
  }

  win() {
    this.points++;
  }
}
