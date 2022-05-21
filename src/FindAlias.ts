import yargs from "yargs";
import FindAliasInstaller from "@/FindAliasInstaller";
import AliasProcessor from "@/AliasProcessor";
import PromptUI from "@/PromptUI";
import FileWriter from "@/FileWriter";

export default class FindAlias {
  static async run() {
    const {
      outputFile,
      install: installFlag,
      height,
      aliases,
    } = yargs(process.argv.slice(2))
      .options({
        outputFile: { type: "string" },
        install: { type: "boolean" },
        height: { type: "number" },
        aliases: { type: "string" },
      })
      .parseSync();
    if (installFlag) {
      FindAliasInstaller.install();
    } else if (aliases !== undefined && outputFile !== undefined) {
      const lines = AliasProcessor.processAliases(aliases);
      const answers = await PromptUI.prompt(lines, height || 4);
      FileWriter.writeToFile(outputFile, answers);
    } else {
      console.log("Incorrect arguments, to install call with --install flag");
    }
  }
}
