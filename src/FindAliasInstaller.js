import chalk from "chalk";
import fs from "fs";
import os from "os";
import * as path from "path";

export default class FindAliasInstaller {
  static installOn(shell) {
    const shellRcFile = path.join(os.homedir(), `.${shell}rc`);
    const source = "\n#find-alias\nsource ~/.find-alias.sh\n";
    if (fs.existsSync(shellRcFile)) {
      fs.copyFileSync(
        ".find-alias.sh",
        path.join(os.homedir(), ".find-alias.sh")
      );
      const bashrcContent = fs.readFileSync(shellRcFile);
      if (!bashrcContent.includes(source)) {
        fs.appendFileSync(shellRcFile, source);
        console.log(chalk.green(`Installed for ${shell}`));
        console.log(
          chalk.green(
            `Please either restart the terminal or in ${shell} shell execute: `
          ) + chalk.green.bold(`source ~/.${shell}rc`)
        );
        console.log(
          chalk.green(`Then type ${chalk.bold("fa")} to use find-alias`)
        );
      } else {
        console.log(chalk.gray(`Already installed for ${shell}`));
      }
    } else {
      console.log(
        chalk.gray(
          `Skipping installing on ${shell} as no .${shell}rc file were found in ${os.homedir()}`
        )
      );
    }
  }

  static install() {
    console.log(chalk.bold("Installing find-alias"));
    FindAliasInstaller.installOn("bash");
    FindAliasInstaller.installOn("zsh");
    console.log(
      chalk.bold(
        "Find-alias is installed, type: fa to use it, if it is not working please restart your terminal"
      )
    );
  }
}
