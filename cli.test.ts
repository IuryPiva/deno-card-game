import { CLIEngine } from "./cli.ts";

Deno.test("CLIEngine", () => {
  new CLIEngine().loop();
});
