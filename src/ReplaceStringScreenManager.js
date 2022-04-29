import ScreenManager from "inquirer/lib/utils/screen-manager.js";

export default class ReplaceStringScreenManager extends ScreenManager {
  constructor(rl, searchValue, replacer) {
    super(rl);
    this.searchValue = searchValue;
    this.replacer = replacer;
  }

  render(content, bottomContent, spinning = false) {
    const replacedContent = content.replace(this.searchValue, this.replacer);
    super.render(replacedContent, bottomContent, spinning);
  }
}
