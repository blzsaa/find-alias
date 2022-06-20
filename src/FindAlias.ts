import FindAliasInstaller from "@/FindAliasInstaller";
import AliasProcessor from "@/AliasProcessor";
import PromptUI from "@/PromptUI";
import OutputWriter from "@/OutputWriter";
import FindAliasCommandInterpreter from "./FindAliasCommandInterpreter";

export default class FindAlias {
  static async run() {
    const command = FindAliasCommandInterpreter.interpret(
      process.argv.slice(2)
    );
    if ("configure" in command) {
      FindAliasInstaller.install(command.configure);
    } else {
      const lines = AliasProcessor.processAliases(command.aliases);
      const answer = await PromptUI.prompt(lines, command.pageSize);
      OutputWriter.write(command.outputFile, answer);
    }
  }
}
