import pc = require("picocolors");
import inquirer = require("inquirer");
import { PromptLine } from "@/types";

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
    if (
      aliasesList === undefined ||
      aliasesList === null ||
      aliasesList === ""
    ) {
      return [];
    }
    return aliasesList
      .split("\n")
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

  static processAliases(aliasesList: string) {
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
