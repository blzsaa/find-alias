import pc from "picocolors";
import fs from "fs";
import os from "os";
import * as path from "path";

export default class FindAliasInstaller {
  static install(commandName: string) {
    console.log(pc.bold("Installing find-alias"));
    const supportedShells = ["bash", "zsh"];
    const installedShells = supportedShells.filter((shell) => {
      const shellRcFile = path.join(os.homedir(), `.${shell}rc`);
      return fs.existsSync(shellRcFile);
    });
    if (installedShells.length > 0) {
      FindAliasInstaller.writeConfigFile(commandName);
    }
    installedShells.forEach((shell) => {
      FindAliasInstaller.installOn(shell);
    });
    console.log(
      `Find-alias is installed, restart your terminal and type: ${pc.bold(
        commandName
      )} to use it`
    );
  }

  private static installOn(shell: string) {
    console.log(`Installing for ${shell}`);
    const shellRcFile = path.join(os.homedir(), `.${shell}rc`);
    const source =
      '\n#find-alias\n[[ -s "$HOME/.find-alias.sh" ]] && source "$HOME/.find-alias.sh"\n';

    const bashrcContent = fs.readFileSync(shellRcFile);
    if (!bashrcContent.includes(source)) {
      fs.appendFileSync(shellRcFile, source);
      console.log(pc.green(`Installed for ${shell}`));
    } else {
      console.log(pc.gray(`Already installed for ${shell}`));
    }
  }

  private static writeConfigFile(commandName: string) {
    console.log(`Writing ${path.join(os.homedir(), ".find-alias.sh")} file`);
    const content = fs.readFileSync(
      path.join(__dirname, "../find-alias.sh"),
      "utf8"
    );
    fs.writeFileSync(
      path.join(os.homedir(), ".find-alias.sh"),
      content.replace(/<find-alias-caller>/g, commandName)
    );
    console.log(`File written`);
  }
}
