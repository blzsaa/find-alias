import pc from "picocolors";
import fs from "fs";
import os from "os";
import * as path from "path";

export default class FindAliasInstaller {
  static installOn(shell: string) {
    const shellRcFile = path.join(os.homedir(), `.${shell}rc`);
    const source =
      "\n#find-alias\nif command -v fa &> /dev/null; then source ~/find-alias.sh; fi\n";
    if (fs.existsSync(shellRcFile)) {
      fs.copyFileSync(
        "find-alias.sh",
        path.join(os.homedir(), "find-alias.sh")
      );
      const bashrcContent = fs.readFileSync(shellRcFile);
      if (!bashrcContent.includes(source)) {
        fs.appendFileSync(shellRcFile, source);
        console.log(pc.green(`Installed for ${shell}`));
        const command = `source ~/.${shell}rc`;
        console.log(
          pc.green(
            `Please either restart the terminal or in ${shell} shell execute: ${pc.bold(
              command
            )}`
          )
        );
        console.log(pc.green(`Then type ${pc.bold("fa")} to use find-alias`));
      } else {
        console.log(pc.gray(`Already installed for ${shell}`));
      }
    } else {
      console.log(
        pc.gray(
          `Skipping installing on ${shell} as no .${shell}rc file were found in your home directory`
        )
      );
    }
  }

  static install() {
    console.log(pc.bold("Installing find-alias"));
    FindAliasInstaller.installOn("bash");
    FindAliasInstaller.installOn("zsh");
    console.log(
      pc.bold(
        "Find-alias is installed, restart your terminal and type: fa to use it"
      )
    );
  }
}
