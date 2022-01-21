import { Card } from "./deck.ts";
import { toNumberEmoji } from "./emoji.ts";

export class Player {
  points = 0;
  reaction = `😊`;
  mark = ``;

  constructor(private hand: Card[]) {}

  get emojiPoint() {
    return toNumberEmoji(this.points);
  }

  showHand(): typeof this.hand {
    return structuredClone(this.hand);
  }

  get handSize() {
    return this.hand.length;
  }

  play() {
    return this.hand.pop();
  }

  calmdown() {
    this.reaction = `🙂`;
  }

  handleVictory() {
    this.points++;
    this.reaction = `😝`;
    this.mark = `✅`;
  }

  handleLoss() {
    this.points++;
    this.reaction = `😡`;
    this.mark = `❌`;
  }
}
