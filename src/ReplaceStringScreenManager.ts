import ScreenManager = require("inquirer/lib/utils/screen-manager");
import { Interface as ReadLineInterface } from "readline";

export default class ReplaceStringScreenManager extends ScreenManager {
  constructor(
    rl: ReadLineInterface,
    private searchValue: string,
    private replacer: string
  ) {
    super(rl);
  }

  render(content: string, bottomContent: string) {
    const replacedContent = content.replace(this.searchValue, this.replacer);
    super.render(replacedContent, bottomContent);
  }
}
