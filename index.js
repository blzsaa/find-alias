#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import inquirerPrompt from "inquirer-autocomplete-prompt";
import Fuse from "fuse.js";
import fs from "fs";
import { homedir } from "os";
import * as path from "path";

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

function copyFile() {
  fs.copyFileSync(".find-alias.sh", path.join(homedir(), ".find-alias.sh"));
}

function installOn(shell) {
  const shellRcFile = path.join(homedir(), `.${shell}rc`);
  const source = `\n#find-alias\nsource ~/.find-alias.sh\n`;
  if (fs.existsSync(shellRcFile)) {
    const bashrcContent = fs.readFileSync(shellRcFile);
    if (!bashrcContent.includes(source)) {
      fs.appendFileSync(shellRcFile, source);
      console.log(chalk.green(`Installed for ${shell}`));
      console.log(
        chalk.green(
          `Please either restart the terminal or when you run ${shell} execute: source ~/.${shell}rc `
        )
      );
      console.log(
        chalk.green(`Then type ${chalk.bold("fa")} to use find-alias`)
      );
    } else {
      console.log(chalk.gray(`Already installed for ${shell}`));
    }
  } else {
    console.log(
      chalk.gray(
        `Skipping installing on ${shell} as no .${shell}rc file were found in ${homedir()}`
      )
    );
  }
}

function install() {
  console.log(chalk.bold("Installing find-alias"));
  copyFile();
  installOn("bash");
  installOn("zsh");
  console.log(
    chalk.bold(
      "Find-alias is installed, type: fa to use it, if it is not working please restart your terminal"
    )
  );
}

async function main() {
  if (process.argv.length === 2) {
    install();
    return;
  }
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

main().then((r) => r);
