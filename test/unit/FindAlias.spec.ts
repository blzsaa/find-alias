import sinon from "ts-sinon";
import chai from "chai";

import FindAliasInstaller from "@/FindAliasInstaller";
import FindAlias from "@/FindAlias";
import FindAliasCommandInterpreter from "../../src/FindAliasCommandInterpreter";
import AliasProcessor from "../../src/AliasProcessor";
import PromptUI from "../../src/PromptUI";
import OutputWriter from "../../src/OutputWriter";
import { PromptLine } from "../../src/types";
import Sinon from "ts-sinon";
import { transform } from "./helper";

chai.should();

describe("FindAlias", () => {
  let originalProcessArgv = JSON.stringify(process.argv);
  let findAliasInstallerStub: Sinon.SinonStub<[string], void>;
  let aliasProcessorStub: Sinon.SinonStub<[string], PromptLine[]>;
  let promptUIStub: Sinon.SinonStub<[PromptLine[], number], Promise<string>>;
  let outputWriterStub: Sinon.SinonStub<[string | undefined, string], void>;

  before(() => {
    originalProcessArgv = JSON.stringify(process.argv);
  });

  beforeEach(() => {
    findAliasInstallerStub = sinon.stub(FindAliasInstaller, "install");
    aliasProcessorStub = sinon.stub(AliasProcessor, "processAliases");
    promptUIStub = sinon.stub(PromptUI, "prompt");
    outputWriterStub = sinon.stub(OutputWriter, "write");
  });

  afterEach(() => {
    sinon.restore();
    process.argv = JSON.parse(originalProcessArgv);
  });

  describe("when interpreter returns with config object", () => {
    it("should call FindAliasInstaller.install()", () => {
      process.argv = ["arg1", "arg2", "arg3", "arg4"];
      sinon
        .stub(FindAliasCommandInterpreter, "interpret")
        .withArgs(["arg3", "arg4"])
        .returns({
          configure: "command-name",
        });

      FindAlias.run();

      sinon.assert.calledOnce(findAliasInstallerStub);

      findAliasInstallerStub.firstCall.args.should.be.deep.equal([
        "command-name",
      ]);
      sinon.assert.notCalled(aliasProcessorStub);
      sinon.assert.notCalled(promptUIStub);
      sinon.assert.notCalled(outputWriterStub);
    });
  });
  describe("when interpreter returns with alias object", () => {
    it("should call processAlias, prompt and writeToFile()", async () => {
      process.argv = ["arg1", "arg2", "arg3", "arg4"];
      sinon
        .stub(FindAliasCommandInterpreter, "interpret")
        .withArgs(["arg3", "arg4"])
        .returns({
          aliases: "aliases",
          outputFile: "outputFile",
          pageSize: 12,
        });

      aliasProcessorStub
        .withArgs("aliases")
        .returns(transform(["alias1", "alias2", "alias3"]));
      promptUIStub
        .withArgs(transform(["alias1", "alias2", "alias3"]), 12)
        .resolves("answer");

      await FindAlias.run();

      outputWriterStub.firstCall.args.should.be.deep.equal([
        "outputFile",
        "answer",
      ]);
      sinon.assert.notCalled(findAliasInstallerStub);
    });
  });
});
