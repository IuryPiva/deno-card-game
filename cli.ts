import {
  Number,
  Select,
} from "https://deno.land/x/cliffy@v0.20.1/prompt/mod.ts";
import { ansi } from "https://deno.land/x/cliffy@v0.20.1/ansi/mod.ts";
import { DrawableGame } from "./game.ts";

export class CLIEngine {
  constructor(private Game = DrawableGame) {}

  game: DrawableGame | undefined;

  async selectGameMode(): Promise<{ playerCount: number }> {
    const gameMode = { playerCount: 2 };

    const option = await Select.prompt({
      message: "SELECT GAME MODE:",
      options: [
        { name: "TWO PLAYERS", value: "2" },
        { name: "CUSTOM PLAYER COUNT", value: "custom" },
      ],
    });

    if (option == "custom") {
      gameMode.playerCount = await Number.prompt({
        message: "PLAYER COUNT:",
        min: 2,
        max: 52,
      });
    }

    return gameMode;
  }

  clearScreen() {
    console.log(ansi.clearScreen());
  }

  private async startGame() {
    this.draw(this.Game.drawTitle());
    const { playerCount } = await this.selectGameMode();

    return new this.Game(playerCount);
  }

  draw(screen: string) {
    this.clearScreen();
    console.log(screen);
  }

  async loop(): Promise<void> {
    if (!this.game) {
      this.game = await this.startGame();
      this.draw(this.game.draw());

      return this.loop();
    }

    if (!this.game.finished) {
      const options = [];

      if (this.game.roundsLeft) {
        options.push({ name: "PLAY NEXT CARD", value: "play" });
        options.push({ name: "SKIP TO GAME RESULTS", value: "skip" });
      } else {
        options.push({ name: "SHOW GAME RESULTS", value: "skip" });
      }

      const option = await Select.prompt({
        message: "",
        prefix: "",
        options,
      });

      if (option == "play") {
        this.game.round();
        this.draw(this.game.draw());
        return this.loop();
      }

      if (option == "skip") {
        const game = this.game;
        this.game.fastForward(() => this.draw(game.draw()));
      }
    }
  }
}
