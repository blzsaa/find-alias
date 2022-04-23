import chalk from "chalk";
import inquirer from "inquirer";
import inquirerPrompt from "inquirer-autocomplete-prompt";
import Fuse from "fuse.js";
import { spawn } from "child_process";

inquirer.registerPrompt("autocomplete", inquirerPrompt);

function sanitizeAlias(b) {
  // https://unix.stackexchange.com/a/11382
  return b.startsWith("-- ") ? b.substring(3) : b;
}

function onExit(childProcess) {
  return new Promise((resolve, reject) => {
    childProcess.once("exit", (code) => {
      if (code === 0) {
        resolve(undefined);
      } else {
        reject(Error(`Exit with error code: ${code}`));
      }
    });
    childProcess.once("error", (err) => {
      reject(err);
    });
  });
}

async function executeCommand(commandWithArgs) {
  const args = commandWithArgs.split(/(\s+)/).flatMap((a) => ["key", a]);
  args.push("key", "\n");
  try {
    const childProcess = spawn("xdotool", args, {
      stdio: [process.stdin],
    });
    await onExit(childProcess);
  } catch (e) {
    console.log("Could not execute command:", e);
    console.log(commandWithArgs);
  }
}

function processAliases() {
  const aliases = process.argv
    .slice(3)
    .join(" ")
    .split(/ ?alias /)
    .filter((a) => a && !a.includes("index.js $(alias)'"))
    .map((line) => sanitizeAlias(line))
    .map((aliasLine) => {
      const shortcut = aliasLine.substring(0, aliasLine.indexOf("="));
      const command = aliasLine.substring(aliasLine.indexOf("="));
      const y = chalk.bold(shortcut) + chalk.gray(command);
      return { name: y, value: shortcut, original: aliasLine };
    });
  aliases.push(new inquirer.Separator(), {
    name: chalk.red("<<exit>>"),
    value: "<<exit>>",
    original: "<<exit>>",
  });
  return aliases;
}

async function main() {
  const pageSize = Math.max(process.argv[2] - 4, 4);
  const lines = processAliases();

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

  if (answers.result === "<<exit>>") {
    process.exit(0);
  }

  await executeCommand(answers.result);
}

await main();
