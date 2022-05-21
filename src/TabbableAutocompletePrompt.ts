import AutocompletePrompt = require("inquirer-autocomplete-prompt");
import { Answers, QuestionCollection } from "inquirer";
import { Interface as ReadLineInterface } from "readline";
import ReplaceStringScreenManager from "@/ReplaceStringScreenManager";

export default class TabbableAutocompletePrompt extends AutocompletePrompt<Answers> {
  submitKey?: string = undefined;

  constructor(
    questions: QuestionCollection,
    rl: ReadLineInterface,
    answers: Answers
  ) {
    super(questions, rl, answers);
    super.screen = new ReplaceStringScreenManager(
      this.rl,
      "(Use arrow keys or type to search)",
      "(Use arrow keys or type to search, <enter> to execute command, <tab> to add extra arguments before executing the command)"
    );
  }

  onKeypress(e: { key: { name: string; ctrl: boolean }; value: string }) {
    const keyName = (e.key && e.key.name) || undefined;
    if (keyName === "tab") {
      this.submitKey = "tab";
      this.onSubmit(this.rl.line);
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
