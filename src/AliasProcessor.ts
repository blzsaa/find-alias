import pc = require("picocolors");
import inquirer = require("inquirer");
import { PromptLine } from "@/types";
import fs from "fs";

export default class AliasProcessor {
  static sanitizeAlias(a: string) {
    // bash format: alias key='command' vs zsh format: key=command
    const b = a.startsWith("alias ") ? a.substring("alias ".length) : a;
    // https://unix.stackexchange.com/a/11382
    return b.startsWith("-- ") ? b.substring(3) : b;
  }

  static sanitizeCommand(a: string) {
    return a.startsWith("='") ? a.slice(2, -1) : a.substring(1);
  }

  static cutAndTransformAliases(aliasesList: string) {
    return aliasesList
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .map((line) => AliasProcessor.sanitizeAlias(line))
      .map((aliasLine) => {
        const shortcut = aliasLine.substring(0, aliasLine.indexOf("="));
        const command = aliasLine.substring(aliasLine.indexOf("="));
        const y = pc.bold(shortcut) + pc.gray(command);
        return {
          name: y,
          value: {
            key: shortcut,
            command: AliasProcessor.sanitizeCommand(command),
          },
          original: aliasLine,
        };
      });
  }

  static processAliases(aliasesFile: string) {
    const aliasesList = fs.readFileSync(aliasesFile, "utf8");
    const aliases: PromptLine[] =
      AliasProcessor.cutAndTransformAliases(aliasesList);
    aliases.push(
      ...[
        new inquirer.Separator(),
        {
          name: pc.red("<<exit>>"),
          value: { key: "", command: "" },
          original: "<<exit>>",
        },
      ]
    );
    return aliases;
  }
}
