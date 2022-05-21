import sinon, { stubInterface } from "ts-sinon";
import AutocompletePrompt from "inquirer-autocomplete-prompt";
import chai from "chai";
import TabbableAutocompletePrompt from "@/TabbableAutocompletePrompt";
import { Interface as ReadLineInterface } from "readline";

chai.should();

describe("TabbableAutocompletePrompt", () => {
  let underTestSuper: sinon.SinonMock;
  let readLineInterfaceStub: ReadLineInterface;
  let underTest: TabbableAutocompletePrompt;
  beforeEach(() => {
    underTestSuper = sinon.mock(AutocompletePrompt.prototype);
    underTest = TabbableAutocompletePrompt.prototype;
  });
  afterEach(() => {
    sinon.restore();
  });
  describe("when calling onKeypress", () => {
    beforeEach(() => {
      underTest.submitKey = "originalValue";

      readLineInterfaceStub = stubInterface<ReadLineInterface>();

      underTest["rl"] = readLineInterfaceStub;
    });
    afterEach(() => {
      sinon.restore();
    });
    describe("with tab key", () => {
      it('should set value "tab" to submitKey field and call onSubmit', () => {
        underTestSuper.expects("onSubmit").once();
        underTestSuper.expects("onKeypress").never();

        underTest.onKeypress({
          key: { name: "tab", ctrl: false },
          value: "value",
        });

        underTestSuper.verify();
        underTest.submitKey?.should.be.deep.equal("tab");
      });
    });
    describe(`with any key but tab`, () => {
      [
        { key: { name: "a", ctrl: false }, value: "value" },
        { key: { name: "b", ctrl: false }, value: "value" },
        { key: { name: "", ctrl: false }, value: "value" },
      ].forEach((key) => {
        describe(`, e.g. ${JSON.stringify(key)}`, () => {
          it("should not set any value to submitKey field and call onKeypress", () => {
            underTestSuper.expects("onSubmit").never();
            underTestSuper.expects("onKeypress").once();

            underTest.onKeypress(key);

            underTestSuper.verify();
            underTest.submitKey?.should.be.deep.equal("originalValue");
          });
        });
      });
    });
  });
  describe("when calling run", () => {
    describe("and submitting with tab key", () => {
      it('should set value "tab" to submitKey field', async () => {
        underTestSuper
          .expects("run")
          .resolves({ submitKey: "tab", otherField: "asd" });
        underTest.submitKey = "tab";

        const actual = await underTest.run();

        underTestSuper.verify();
        actual.should.be.deep.equal({ submitKey: "tab", otherField: "asd" });
      });
    });
    describe("and submitting with enter key", () => {
      it('should set value "enter" to submitKey field', async () => {
        underTestSuper.expects("run").resolves({ otherField: "asd" });
        underTest.submitKey = undefined;

        const actual = await underTest.run();

        underTestSuper.verify();
        actual.should.be.deep.equal({ submitKey: "enter", otherField: "asd" });
      });
    });
  });
});
