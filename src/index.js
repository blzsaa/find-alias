#!/usr/bin/env node

import install from "./install.js";
import processAliases from "./processAliases.js";
import promptUI from "./promptUI.js";
import writeToFile from "./writeToFile.js";

async function main() {
  if (process.argv.length === 2) {
    install();
    return;
  }
  const lines = processAliases();
  const answers = await promptUI(lines);
  writeToFile(answers);
}

main().then((r) => r);
