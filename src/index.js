#!/usr/bin/env node

import yargs from "yargs";
import install from "./install.js";
import processAliases from "./processAliases.js";
import promptUI from "./promptUI.js";
import writeToFile from "./writeToFile.js";

async function main() {
  const { argv } = yargs(process.argv.slice(2));
  const { outputFile, install: installFlag, height, aliases } = argv;
  if (installFlag) {
    install();
  } else if (aliases) {
    const lines = processAliases(aliases);
    const answers = await promptUI(lines, height || 4);
    if (outputFile) {
      writeToFile(outputFile, answers);
    }
  } else {
    console.log("Incorrect arguments, to install call with --install flag");
  }
}

main().then((r) => r);
