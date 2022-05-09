import yargs from "yargs";
import FindAliasInstaller from "./FindAliasInstaller.js";
import AliasProcessor from "./AliasProcessor.js";
import PromptUI from "./PromptUI.js";
import FileWriter from "./FileWriter.js";

export default class FindAlias {
  static async run() {
    const { argv } = yargs(process.argv.slice(2));
    const { outputFile, install: installFlag, height, aliases } = argv;
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
