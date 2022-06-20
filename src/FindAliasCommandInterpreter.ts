import yargs from "yargs";
import { Command } from "@/types";

export default class FindAliasCommandInterpreter {
  static interpret(args: string[]): Command {
    const parsed = yargs(args)
      .usage(
        "find-alias [--pageSize <pageSize>] [--output-file <output-file>] <aliases>\nfind-alias --configure\nfind-alias --configure <command-name>"
      )
      .options({
        configure: {
          alias: "c",
          description:
            "configure find-alias to be called by <command-name>, if not specified, it will be called fa",
          requiresArg: false,
          demandOption: false,
          type: "string",
        },
        outputFile: {
          alias: "o",
          description: "output-file",
          requiresArg: true,
          demandOption: false,
          type: "string",
        },
        pageSize: {
          alias: "p",
          description: "number of lines that will be rendered",
          requiresArg: true,
          demandOption: false,
          default: 4,
          type: "number",
        },
      })
      .implies("name", "configure")
      .alias("version", "v")
      .help("h")
      .alias("h", "help")
      .middleware((argv) => {
        if (argv.configure === "") {
          argv.configure = "fa";
          argv.c = "fa";
        }
      })
      .check((argv) => {
        const filePaths = argv._;
        if (argv.configure) {
          return true;
        }
        if (filePaths.length === 0) {
          throw new Error("aliases file is required");
        } else if (filePaths.length > 1) {
          throw new Error("only one aliases file is allowed");
        } else {
          return true;
        }
      })
      .parseSync();
    if (parsed.configure) {
      return {
        configure: parsed.configure,
      };
    } else if (parsed._[0] !== undefined) {
      return {
        aliases: parsed._[0] as string,
        outputFile: parsed.outputFile,
        pageSize: parsed.pageSize,
      };
    }
    throw new Error("Parsing error");
  }
}
