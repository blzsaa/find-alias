import sinon from "sinon";
import chai from "chai";
import os from "os";
import stripAnsi from "strip-ansi";

import FindAliasInstaller from "../../src/FindAliasInstaller.js";
import AliasProcessor from "../../src/AliasProcessor.js";
import PromptUI from "../../src/PromptUI.js";
import FileWriter from "../../src/FileWriter.js";
import FindAlias from "../../src/FindAlias.js";

chai.should();

describe("index", () => {
  let consoleStub;
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

  function verifyLogs(...expectedLogs) {
    expectedLogs.forEach((expectedLog, index) => {
      const actualMessage = consoleStub.getCall(index).args[0];
      stripAnsi(actualMessage).should.be.equal(expectedLog);
    });
    consoleStub.getCalls().should.have.length(expectedLogs.length);
  }

  describe("when calling main without arguments", () => {
    it("should write out error message to console", () => {
      FindAlias.run();

      verifyLogs("Incorrect arguments, to install call with --install flag");
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
      let aliasProcessorStub;
      let promptUIStub;
      let fileWriterStub;

      beforeEach(() => {
        aliasProcessorStub = sinon
          .stub(AliasProcessor, "processAliases")
          .returns(["alias1", "alias2", "alias3"]);
        promptUIStub = sinon
          .stub(PromptUI, "prompt")
          .returns("alias1 arg1 arg2");
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
            ["alias1", "alias2", "alias3"],
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
            ["alias1", "alias2", "alias3"],
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
