import inquirer from "inquirer";
import inquirerPrompt from "inquirer-autocomplete-prompt";
import Fuse from "fuse.js";

inquirer.registerPrompt("autocomplete", inquirerPrompt);

export default async function promptUI(lines, terminalHeight) {
  const pageSize = Math.max(terminalHeight - 4, 4);

  const fuse = new Fuse(lines, {
    keys: ["original"],
  });

  return inquirer.prompt([
    {
      type: "autocomplete",
      name: "result",
      source: (_, input = "") =>
        input ? fuse.search(input).map((a) => a.item) : lines,
      pageSize,
      validate: (val) => (val ? true : "Type something!"),
    },
  ]);
}
