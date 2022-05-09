import sinon from "sinon/pkg/sinon-esm.js";
import inquirer from "inquirer";
import chai from "chai";
import PromptUI from "../../src/PromptUI.js";

chai.should();

function matchPromptWith(name, type) {
  return sinon.match(
    (value) => value[0].name === name && value[0].type === type
  );
}

describe("promptUI", () => {
  let stub;
  beforeEach(() => {
    stub = sinon.stub(inquirer, "prompt");
  });
  afterEach(() => {
    sinon.restore();
  });
  describe("when submitting an answer with enter key", () => {
    it("should just return with the answer", async () => {
      stub
        .withArgs(matchPromptWith("alias", "autocomplete"))
        .resolves({ alias: { key: "b", submitKey: "enter" } });

      const actual = await PromptUI.prompt(["a", "b", "c"], 10);

      actual.should.be.deep.equal("b");
    });
  });
  describe("when submitting an answer with tab key", () => {
    it("should ask for extra arguments and add them to the return value", async () => {
      stub
        .withArgs(matchPromptWith("alias", "autocomplete"))
        .resolves({ alias: { key: "b", submitKey: "tab" } })
        .withArgs(matchPromptWith("args", "input"))
        .resolves({ args: "arg1 arg2" });

      const actual = await PromptUI.prompt(["a", "b", "c"], 10);

      actual.should.be.deep.equal("b arg1 arg2");
    });
  });
});
