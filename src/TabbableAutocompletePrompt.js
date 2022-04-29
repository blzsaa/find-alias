import AutocompletePrompt from "inquirer-autocomplete-prompt";
import ReplaceStringScreenManager from "./ReplaceStringScreenManager.js";

export default class TabbableAutocompletePrompt extends AutocompletePrompt {
  submitKey = undefined;

  constructor(
    questions /*: Array<any> */,
    rl /*: readline$Interface */,
    answers /*: Array<any> */
  ) {
    super(questions, rl, answers);
    super.screen = new ReplaceStringScreenManager(
      this.rl,
      "(Use arrow keys or type to search)",
      "(Use arrow keys or type to search, <enter> to execute command, <tab> to add extra arguments before executing the command)"
    );
  }

  onKeypress(e /* : {key: { name: string, ctrl: boolean }, value: string } */) {
    const keyName = (e.key && e.key.name) || undefined;
    if (keyName === "tab") {
      this.submitKey = "tab";
      this.onSubmit();
    } else {
      super.onKeypress(e);
    }
  }

  async run() {
    const a = await super.run();
    a.submitKey = this.submitKey || "enter";
    return a;
  }
}
