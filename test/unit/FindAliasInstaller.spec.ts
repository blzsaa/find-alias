import sinon from "ts-sinon";
import fs from "fs";
import os from "os";
import FindAliasInstaller from "@/FindAliasInstaller";
import { verifyLogs } from "./helper";
import chai = require("chai");
import chaiString = require("chai-string");
import sinonChai = require("sinon-chai");

chai.should();
chai.use(chaiString);
chai.use(sinonChai);

describe("FindAliasInstaller", () => {
  let readFileSync: sinon.SinonStub;
  let writeFileSync: sinon.SinonStub;
  let existsSync: sinon.SinonStub;
  let appendFileSync: sinon.SinonStub;
  let consoleStub: sinon.SinonStub;

  const rcFileContent =
    "\n" +
    "#find-alias\n" +
    '[[ -s "$HOME/.find-alias.sh" ]] && command -v find-alias >/dev/null 2>&1  && source "$HOME/.find-alias.sh"\n' +
    "\n";

  beforeEach(() => {
    readFileSync = sinon.stub(fs, "readFileSync");
    writeFileSync = sinon.stub(fs, "writeFileSync");
    existsSync = sinon.stub(fs, "existsSync");
    appendFileSync = sinon.stub(fs, "appendFileSync");
    consoleStub = sinon.stub(console, "log");

    readFileSync
      .withArgs(
        sinon.match((value) => ("" + value).endsWith("find-alias.sh")),
        "utf8"
      )
      .returns("find-alias-script <find-alias-caller> <find-alias-caller>");
    sinon.stub(os, "homedir").withArgs().returns("/home/dir");
  });

  afterEach(() => {
    sinon.restore();
  });
  describe("when neither bash nor zsh are installed", () => {
    it("should skip copying config files and notify user about it", () => {
      existsSync.returns(false);

      FindAliasInstaller.install("fa");

      writeFileSync.should.have.not.been.called;
      appendFileSync.should.have.not.been.called;

      verifyLogs(
        consoleStub,
        "Installing find-alias",
        "Find-alias is installed, restart your terminal and type: fa to use it"
      );
    });
  });

  describe("when bash is installed but zsh is not", () => {
    describe("and it is a first time install of find-alias", () => {
      it("should copy find-alias.sh, set up .bashrc file ans skip zsh", () => {
        existsSync.withArgs("/home/dir/.bashrc").returns(true);
        existsSync.withArgs("/home/dir/.zshrc").returns(false);

        readFileSync.withArgs("/home/dir/.bashrc").returns("");

        FindAliasInstaller.install("fa");

        verifyFindAliasShFileWasCopied();
        appendFileSync.should.have.been.calledWith(
          "/home/dir/.bashrc",
          rcFileContent
        );
        verifyLogs(
          consoleStub,
          "Installing find-alias",
          "Writing /home/dir/.find-alias.sh file",
          "File written",
          "Installing for bash",
          "Installed for bash",
          "Find-alias is installed, restart your terminal and type: fa to use it"
        );
      });
    });
    describe("and it is a reinstall", () => {
      it("should copy find-alias.sh, and skip setting up .bashrc file ans skip zsh", () => {
        existsSync.withArgs("/home/dir/.bashrc").returns(true);
        existsSync.withArgs("/home/dir/.zshrc").returns(false);

        readFileSync
          .withArgs("/home/dir/.bashrc")
          .returns(`<prefix>${rcFileContent}<suffix>`);

        FindAliasInstaller.install("fa");

        verifyFindAliasShFileWasCopied();
        appendFileSync.should.have.not.been.called;
        verifyLogs(
          consoleStub,
          "Installing find-alias",
          "Writing /home/dir/.find-alias.sh file",
          "File written",
          "Installing for bash",
          "Already installed for bash",
          "Find-alias is installed, restart your terminal and type: fa to use it"
        );
      });
    });
  });

  describe("when both zsh and bash are installed", () => {
    describe("and it is a first time install of find-alias", () => {
      it("should copy find-alias.sh, set up both .bashrc and .zshrc files", () => {
        existsSync.withArgs("/home/dir/.bashrc").returns(true);
        existsSync.withArgs("/home/dir/.zshrc").returns(true);

        readFileSync.withArgs("/home/dir/.zshrc").returns("");
        readFileSync.withArgs("/home/dir/.bashrc").returns("");

        FindAliasInstaller.install("fa");

        verifyFindAliasShFileWasCopied();
        appendFileSync.firstCall.should.have.been.calledWith(
          "/home/dir/.bashrc",
          rcFileContent
        );
        appendFileSync.secondCall.should.have.been.calledWith(
          "/home/dir/.zshrc",
          rcFileContent
        );
        verifyLogs(
          consoleStub,
          "Installing find-alias",
          "Writing /home/dir/.find-alias.sh file",
          "File written",
          "Installing for bash",
          "Installed for bash",
          "Installing for zsh",
          "Installed for zsh",
          "Find-alias is installed, restart your terminal and type: fa to use it"
        );
      });
    });
    describe("and it is a reinstall", () => {
      it("should copy find-alias.sh, and skip setting up .bashrc file ans skip zsh", () => {
        existsSync.withArgs("/home/dir/.bashrc").returns(true);
        existsSync.withArgs("/home/dir/.zshrc").returns(true);

        readFileSync
          .withArgs("/home/dir/.bashrc")
          .returns(`<prefix>${rcFileContent}<suffix>`);
        readFileSync
          .withArgs("/home/dir/.zshrc")
          .returns(`<prefix>${rcFileContent}<suffix>`);

        FindAliasInstaller.install("fa");

        verifyFindAliasShFileWasCopied();
        appendFileSync.should.have.not.been.called;

        verifyLogs(
          consoleStub,
          "Installing find-alias",
          "Writing /home/dir/.find-alias.sh file",
          "File written",
          "Installing for bash",
          "Already installed for bash",
          "Installing for zsh",
          "Already installed for zsh",
          "Find-alias is installed, restart your terminal and type: fa to use it"
        );
      });
    });
  });

  describe("input of install will be the new command name", () => {
    it("should copy find-alias.sh, set up .bashrc file ans skip zsh", () => {
      existsSync.withArgs("/home/dir/.bashrc").returns(true);
      existsSync.withArgs("/home/dir/.zshrc").returns(false);

      readFileSync.withArgs("/home/dir/.bashrc").returns("");

      FindAliasInstaller.install("fa2");

      verifyFindAliasShFileWasCopied("fa2");
      appendFileSync.firstCall.should.have.been.calledWith(
        "/home/dir/.bashrc",
        rcFileContent
      );
      verifyLogs(
        consoleStub,
        "Installing find-alias",
        "Writing /home/dir/.find-alias.sh file",
        "File written",
        "Installing for bash",
        "Installed for bash",
        "Find-alias is installed, restart your terminal and type: fa2 to use it"
      );
    });
  });

  function verifyFindAliasShFileWasCopied(expectedCommandName = "fa") {
    const args = writeFileSync.firstCall.args;
    args[0].should.endWith("/home/dir/.find-alias.sh");
    args[1].should.be.equal(
      `find-alias-script ${expectedCommandName} ${expectedCommandName}`
    );
  }
});
