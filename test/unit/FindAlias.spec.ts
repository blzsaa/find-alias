import sinon from "ts-sinon";
import chai from "chai";
import os from "os";

import FindAliasInstaller from "@/FindAliasInstaller";
import AliasProcessor from "@/AliasProcessor";
import PromptUI from "@/PromptUI";
import FileWriter from "@/FileWriter";
import FindAlias from "@/FindAlias";
import { transform, verifyLogs } from "./helper";

chai.should();

describe("index", () => {
  let consoleStub: sinon.SinonStub;
  let originalProcessArgv = JSON.stringify(process.argv);
  before(() => {
    originalProcessArgv = JSON.stringify(process.argv);
  });
  beforeEach(() => {
    consoleStub = sinon.stub(console, "log");

    sinon.stub(os, "homedir").withArgs().returns("/home/dir");
  });

  afterEach(() => {
    sinon.restore();
    process.argv = JSON.parse(originalProcessArgv);
  });

  describe("when calling main without arguments", () => {
    it("should write out error message to console", () => {
      FindAlias.run();

      verifyLogs(
        consoleStub,
        "Incorrect arguments, to install call with --install flag"
      );
    });
  });
  describe("when calling main with install flag", () => {
    it("should call to install()", () => {
      process.argv.push("--install");
      const install = sinon.stub(FindAliasInstaller, "install").returns();

      FindAlias.run();

      sinon.assert.calledOnce(install);
    });
  });
  describe("when calling main with aliases", () => {
    describe("and with outputFile", () => {
      let aliasProcessorStub: sinon.SinonStub;
      let promptUIStub: sinon.SinonStub;
      let fileWriterStub: sinon.SinonStub;

      beforeEach(() => {
        aliasProcessorStub = sinon
          .stub(AliasProcessor, "processAliases")
          .returns(transform(["alias1", "alias2", "alias3"]));
        promptUIStub = sinon
          .stub(PromptUI, "prompt")
          .resolves("alias1 arg1 arg2");
        fileWriterStub = sinon.stub(FileWriter, "writeToFile");
      });
      describe("and no terminal height", () => {
        it("should call 1st processAliases 2nd promptUI 3rd writeToFile, and use 4 as terminal height", async () => {
          process.argv.push(
            "--aliases=alias1alias2alias3",
            "--output-file=./fakeFile"
          );

          await FindAlias.run();

          aliasProcessorStub.firstCall.args.should.be.deep.equal([
            "alias1alias2alias3",
          ]);
          promptUIStub.firstCall.args.should.be.deep.equal([
            transform(["alias1", "alias2", "alias3"]),
            4,
          ]);
          fileWriterStub.firstCall.args.should.be.deep.equal([
            "./fakeFile",
            "alias1 arg1 arg2",
          ]);
        });
      });
      describe("and with terminal height", () => {
        it("should call 1st processAliases 2nd promptUI 3rd writeToFile", async () => {
          process.argv.push(
            "--aliases=alias1alias2alias3",
            "--output-file=./fakeFile",
            "--height=100"
          );

          await FindAlias.run();

          aliasProcessorStub.firstCall.args.should.be.deep.equal([
            "alias1alias2alias3",
          ]);
          promptUIStub.firstCall.args.should.be.deep.equal([
            transform(["alias1", "alias2", "alias3"]),
            100,
          ]);
          fileWriterStub.firstCall.args.should.be.deep.equal([
            "./fakeFile",
            "alias1 arg1 arg2",
          ]);
        });
      });
    });
  });
});
