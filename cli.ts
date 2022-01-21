import { Select } from "https://deno.land/x/cliffy@v0.20.1/prompt/mod.ts";
import { ansi } from "https://deno.land/x/cliffy@v0.20.1/ansi/mod.ts";

export async function askPlayerCount() {
  const option: string = await Select.prompt({
    message: "SELECT GAME MODE:",
    options: [
      // TODO: IMPLEMENT OTHER MODES
      { name: "TWO PLAYERS", value: "2" },
    ],
  });

  return parseInt(option);
}

export function clearScreen() {
  ansi.clearScreen();
}
