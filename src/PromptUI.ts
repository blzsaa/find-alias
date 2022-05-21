import Fuse from "fuse.js";
import inquirer = require("inquirer");
import TabbableAutocompletePrompt from "@/TabbableAutocompletePrompt";
import { PromptLine } from "@/types";

inquirer.registerPrompt("autocomplete", TabbableAutocompletePrompt);

export default class PromptUI {
  static async prompt(
    lines: PromptLine[],
    terminalHeight: number
  ): Promise<string> {
    const pageSize = Math.max(terminalHeight - 4, 4);

    const fuse = new Fuse(lines, {
      keys: ["original"],
    });
    const { alias } = await inquirer.prompt([
      {
        type: "autocomplete",
        name: "alias",
        message: "filter aliases",
        source: (_: never, input = "") =>
          input ? fuse.search(input).map((a) => a.item) : lines,
        pageSize,
        validate: (val) => (val ? true : "Type something!"),
      },
    ]);
    if (alias.submitKey === "tab") {
      const { args } = await inquirer.prompt([
        {
          type: "input",
          name: "args",
          message: alias.key,
        },
      ]);
      return `${alias.key} ${args}`;
    }
    return alias.key;
  }
}
