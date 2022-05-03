import chalk from "chalk";
import inquirer from "inquirer";

function sanitizeAlias(a) {
  // bash format: alias key='command' vs zsh format: key=command
  const b = a.startsWith("alias ") ? a.substring("alias ".length) : a;
  // https://unix.stackexchange.com/a/11382
  return b.startsWith("-- ") ? b.substring(3) : b;
}

function sanitizeCommand(a) {
  return a.startsWith("='") ? a.slice(2, -1) : a.substring(1);
}

export default function processAliases(aliasesList) {
  const aliases = aliasesList
    .split("\n")
    .map((line) => sanitizeAlias(line))
    .map((aliasLine) => {
      const shortcut = aliasLine.substring(0, aliasLine.indexOf("="));
      const command = aliasLine.substring(aliasLine.indexOf("="));
      const y = chalk.bold(shortcut) + chalk.gray(command);
      return {
        name: y,
        value: { key: shortcut, command: sanitizeCommand(command) },
        original: aliasLine,
      };
    });
  aliases.push(new inquirer.Separator(), {
    name: chalk.red("<<exit>>"),
    value: { key: "", command: "" },
    original: "<<exit>>",
  });
  return aliases;
}
