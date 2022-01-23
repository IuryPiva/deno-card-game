import { assertEquals } from "https://deno.land/std@0.122.0/testing/asserts.ts";
import { DrawableGame } from "./game.ts";

const baselinesFilePath = new URL("./baselines.json", import.meta.url).pathname;

const baselines: Map<string, string> = new Map(
  JSON.parse(Deno.readTextFileSync(baselinesFilePath)),
);

const createBaselines = Deno.args.find((arg) =>
  arg.startsWith("--create-baseline=")
)?.replace("--create-baseline=", "");

function imageDiff(key: string, image: string) {
  const baseline = baselines.get(key);

  if (!baseline) {
    if (createBaselines?.split(",").some((arg) => arg == key)) {
      baselines.set(key, image);

      Deno.writeTextFileSync(
        baselinesFilePath,
        JSON.stringify([...baselines.entries()]),
      );

      return;
    } else {
      throw new Error(
        `Baseline "${key}" is missing, to create a new baseline run with "--create-baseline=${key}"`,
      );
    }
  }

  assertEquals(
    baseline,
    image,
  );
}

Deno.test("Visual tests", () => {
  imageDiff(
    "drawTitle0",
    DrawableGame.drawTitle(0),
  );

  imageDiff(
    "drawTitle30",
    DrawableGame.drawTitle(30),
  );

  const game = new DrawableGame();
  imageDiff("firstRoundScreen", game.draw());
});
