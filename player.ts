import { Card } from "./deck.ts";
import { DrawableModel } from "./drawable.ts";

export class Player {
  points = 0;
  reaction = `😊`;
  mark = `  `;
  lastCardPlayed: Card | undefined;

  constructor(protected hand: Card[]) {}

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
    this.mark = `✅`;
    this.reaction = `😝`;
  }

  handleLoss() {
    this.mark = `❌`;
    this.reaction = `😡`;
  }

  handleGameVictory() {
    this.mark = `🎊`;
    this.reaction = `🤩`;
  }

  handleGameLoss() {
    this.mark = `⛈`;
    this.reaction = `😭`;
  }
}

export class DrawablePlayer extends Player implements DrawableModel {
  static get sprite() {
    const props = {
      score: "$$$$$$",
      mark: "  !!  ",
      reaction: "  =)  ",
      slot: "------",
    };

    const model = [
      props.score,
      props.mark,
      props.reaction,
    ].join("\n");

    return {
      props,
      model,
    };
  }

  private drawScore() {
    const emojiMap = new Map([
      ["0", "0️⃣ "],
      ["1", "1️⃣ "],
      ["2", "2️⃣ "],
      ["3", "3️⃣ "],
      ["4", "4️⃣ "],
      ["5", "5️⃣ "],
      ["6", "6️⃣ "],
      ["7", "7️⃣ "],
      ["8", "8️⃣ "],
      ["9", "9️⃣ "],
    ]);

    return this.points.toString().padStart(3, "0").split("").map((c) =>
      emojiMap.get(c) ?? c
    ).join("");
  }

  sprite = DrawablePlayer.sprite;

  draw() {
    const { props, model } = this.sprite;

    const drawing = model
      .replace(props.score, this.drawScore())
      .replace(props.mark.trim(), this.mark)
      .replace(props.reaction.trim(), this.reaction)

    return drawing;
  }
}
