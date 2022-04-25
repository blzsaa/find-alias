import chalk from "chalk";
import inquirer from "inquirer";
import inquirerPrompt from "inquirer-autocomplete-prompt";
import Fuse from "fuse.js";
import fs from "fs";

inquirer.registerPrompt("autocomplete", inquirerPrompt);

function sanitizeAlias(a) {
  // bash format: alias key='command' vs zsh format: key=command
  const b = a.startsWith("alias ") ? a.substring("alias ".length) : a;
  // https://unix.stackexchange.com/a/11382
  return b.startsWith("-- ") ? b.substring(3) : b;
}

function sanitizeCommand(a) {
  return a.startsWith("='") ? a.slice(2, -1) : a.substring(1);
}

function processAliases(aliasesInput) {
  const aliases = aliasesInput
    .split("\n")
    .filter((a) => a && !a.includes("index.js $(alias)'"))
    .map((line) => sanitizeAlias(line))
    .map((aliasLine) => {
      const shortcut = aliasLine.substring(0, aliasLine.indexOf("="));
      const command = aliasLine.substring(aliasLine.indexOf("="));
      const y = chalk.bold(shortcut) + chalk.gray(command);
      return { name: y, value: sanitizeCommand(command), original: aliasLine };
    });
  aliases.push(new inquirer.Separator(), {
    name: chalk.red("<<exit>>"),
    value: "<<exit>>",
    original: "<<exit>>",
  });
  return aliases;
}

async function main() {
  const aliasList = process.argv[4];
  const terminalHeight = process.argv[2];
  const outputFile = process.argv[3];

  const pageSize = Math.max(terminalHeight - 4, 4);
  const lines = processAliases(aliasList);

  const fuse = new Fuse(lines, {
    keys: ["original"],
  });

  const answers = await inquirer.prompt([
    {
      type: "autocomplete",
      name: "result",
      source: (_, input = "") =>
        input ? fuse.search(input).map((a) => a.item) : lines,
      pageSize,
      validate: (val) => (val ? true : "Type something!"),
    },
  ]);

  try {
    fs.writeFileSync(outputFile, `${answers.result}\n`);
  } catch (err) {
    console.error(err);
  }
}

await main();
