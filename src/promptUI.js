import inquirer from "inquirer";
import Fuse from "fuse.js";
import TabbableAutocompletePrompt from "./TabbableAutocompletePrompt.js";

inquirer.registerPrompt("autocomplete", TabbableAutocompletePrompt);

export default async function promptUI(lines, terminalHeight) {
  const pageSize = Math.max(terminalHeight - 4, 4);

  const fuse = new Fuse(lines, {
    keys: ["original"],
  });

  const { alias } = await inquirer.prompt([
    {
      type: "autocomplete",
      name: "alias",
      message: "filter aliases",
      source: (_, input = "") =>
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
