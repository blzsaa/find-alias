import sinon from "sinon";
import fs from "fs";
import chai from "chai";
import os from "os";
import stripAnsi from "strip-ansi";
import FindAliasInstaller from "../../src/FindAliasInstaller.js";

chai.should();

describe("install", () => {
  let readFileSync;
  let copyFileSync;
  let existsSync;
  let appendFileSync;
  let consoleStub;

  beforeEach(() => {
    readFileSync = sinon.stub(fs, "readFileSync");
    copyFileSync = sinon.stub(fs, "copyFileSync");
    existsSync = sinon.stub(fs, "existsSync");
    appendFileSync = sinon.stub(fs, "appendFileSync");
    consoleStub = sinon.stub(console, "log");

    sinon.stub(os, "homedir").withArgs().returns("/home/dir");
  });

  afterEach(() => {
    sinon.restore();
  });

  function verifyLogs(...expectedLogs) {
    expectedLogs.forEach((expectedLog, index) => {
      const actualMessage = consoleStub.getCall(index).args[0];
      stripAnsi(actualMessage).should.be.equal(expectedLog);
    });
    consoleStub.getCalls().should.have.length(expectedLogs.length);
  }

  describe("when neither bash nor zsh are installed", () => {
    it("should skip copying config files and notify user about it", () => {
      existsSync.returns(false);

      FindAliasInstaller.install();

      // eslint-disable-next-line no-unused-expressions
      copyFileSync.notCalled.should.be.true;
      // eslint-disable-next-line no-unused-expressions
      appendFileSync.notCalled.should.be.true;

      verifyLogs(
        "Installing find-alias",
        "Skipping installing on bash as no .bashrc file were found in /home/dir",
        "Skipping installing on zsh as no .zshrc file were found in /home/dir",
        "Find-alias is installed, type: fa to use it, if it is not working please restart your terminal"
      );
    });
  });

  describe("when bash is installed but zsh is not", () => {
    describe("and it is a first time install of find-alias", () => {
      it("should copy .find-alias.sh, set up .bashrc file ans skip zsh", () => {
        existsSync.withArgs("/home/dir/.bashrc").returns(true);
        existsSync.withArgs("/home/dir/.zshrc").returns(false);

        readFileSync.withArgs("/home/dir/.bashrc").returns("");

        FindAliasInstaller.install();

        copyFileSync.firstCall.args.should.be.deep.equal([
          ".find-alias.sh",
          "/home/dir/.find-alias.sh",
        ]);
        appendFileSync.firstCall.args.should.be.deep.equal([
          "/home/dir/.bashrc",
          "\n#find-alias\nsource ~/.find-alias.sh\n",
        ]);
        verifyLogs(
          "Installing find-alias",
          "Installed for bash",
          "Please either restart the terminal or in bash shell execute: source ~/.bashrc",
          "Then type fa to use find-alias",
          "Skipping installing on zsh as no .zshrc file were found in /home/dir",
          "Find-alias is installed, type: fa to use it, if it is not working please restart your terminal"
        );
      });
    });
    describe("and it is a reinstall", () => {
      it("should copy .find-alias.sh, and skip setting up .bashrc file ans skip zsh", () => {
        existsSync.withArgs("/home/dir/.bashrc").returns(true);
        existsSync.withArgs("/home/dir/.zshrc").returns(false);

        readFileSync
          .withArgs("/home/dir/.bashrc")
          .returns("<prefix>\n#find-alias\nsource ~/.find-alias.sh\n<suffix>");

        FindAliasInstaller.install();

        copyFileSync.firstCall.args.should.be.deep.equal([
          ".find-alias.sh",
          "/home/dir/.find-alias.sh",
        ]);
        sinon.assert.notCalled(appendFileSync);

        verifyLogs(
          "Installing find-alias",
          "Already installed for bash",
          "Skipping installing on zsh as no .zshrc file were found in /home/dir",
          "Find-alias is installed, type: fa to use it, if it is not working please restart your terminal"
        );
      });
    });
  });
  describe("when both zsh and bash are installed", () => {
    describe("and it is a first time install of find-alias", () => {
      it("should copy .find-alias.sh, set up both .bashrc and .zshrc files", () => {
        existsSync.withArgs("/home/dir/.bashrc").returns(true);
        existsSync.withArgs("/home/dir/.zshrc").returns(true);

        readFileSync.withArgs("/home/dir/.zshrc").returns("");
        readFileSync.withArgs("/home/dir/.bashrc").returns("");

        FindAliasInstaller.install();

        copyFileSync.firstCall.args.should.be.deep.equal([
          ".find-alias.sh",
          "/home/dir/.find-alias.sh",
        ]);
        appendFileSync.firstCall.args.should.be.deep.equal([
          "/home/dir/.bashrc",
          "\n#find-alias\nsource ~/.find-alias.sh\n",
        ]);
        appendFileSync.secondCall.args.should.be.deep.equal([
          "/home/dir/.zshrc",
          "\n#find-alias\nsource ~/.find-alias.sh\n",
        ]);
        verifyLogs(
          "Installing find-alias",
          "Installed for bash",
          "Please either restart the terminal or in bash shell execute: source ~/.bashrc",
          "Then type fa to use find-alias",
          "Installed for zsh",
          "Please either restart the terminal or in zsh shell execute: source ~/.zshrc",
          "Then type fa to use find-alias",
          "Find-alias is installed, type: fa to use it, if it is not working please restart your terminal"
        );
      });
    });
    describe("and it is a reinstall", () => {
      it("should copy .find-alias.sh, and skip setting up .bashrc file ans skip zsh", () => {
        existsSync.withArgs("/home/dir/.bashrc").returns(true);
        existsSync.withArgs("/home/dir/.zshrc").returns(true);

        readFileSync
          .withArgs("/home/dir/.bashrc")
          .returns("<prefix>\n#find-alias\nsource ~/.find-alias.sh\n<suffix>");
        readFileSync
          .withArgs("/home/dir/.zshrc")
          .returns("<prefix>\n#find-alias\nsource ~/.find-alias.sh\n<suffix>");

        FindAliasInstaller.install();

        copyFileSync.firstCall.args.should.be.deep.equal([
          ".find-alias.sh",
          "/home/dir/.find-alias.sh",
        ]);
        sinon.assert.notCalled(appendFileSync);

        verifyLogs(
          "Installing find-alias",
          "Already installed for bash",
          "Already installed for zsh",
          "Find-alias is installed, type: fa to use it, if it is not working please restart your terminal"
        );
      });
    });
  });
});
