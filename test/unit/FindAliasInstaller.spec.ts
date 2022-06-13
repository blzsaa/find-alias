import sinon from "ts-sinon";
import fs from "fs";
import chai = require("chai");
import os from "os";
import FindAliasInstaller from "@/FindAliasInstaller";
import { verifyLogs } from "./helper";

chai.should();

describe("install", () => {
  let readFileSync: sinon.SinonStub;
  let copyFileSync: sinon.SinonStub;
  let existsSync: sinon.SinonStub;
  let appendFileSync: sinon.SinonStub;
  let consoleStub: sinon.SinonStub;

  const content =
    "\n#find-alias\nif command -v fa &> /dev/null; then source ~/.find-alias.sh; fi\n";

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
  describe("when neither bash nor zsh are installed", () => {
    it("should skip copying config files and notify user about it", () => {
      existsSync.returns(false);

      FindAliasInstaller.install();

      copyFileSync.notCalled.should.be.true;
      appendFileSync.notCalled.should.be.true;

      verifyLogs(
        consoleStub,
        "Installing find-alias",
        "Skipping installing on bash as no .bashrc file were found in your home directory",
        "Skipping installing on zsh as no .zshrc file were found in your home directory",
        "Find-alias is installed, restart your terminal and type: fa to use it"
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
          content,
        ]);
        verifyLogs(
          consoleStub,
          "Installing find-alias",
          "Installed for bash",
          "Please either restart the terminal or in bash shell execute: source ~/.bashrc",
          "Then type fa to use find-alias",
          "Skipping installing on zsh as no .zshrc file were found in your home directory",
          "Find-alias is installed, restart your terminal and type: fa to use it"
        );
      });
    });
    describe("and it is a reinstall", () => {
      it("should copy .find-alias.sh, and skip setting up .bashrc file ans skip zsh", () => {
        existsSync.withArgs("/home/dir/.bashrc").returns(true);
        existsSync.withArgs("/home/dir/.zshrc").returns(false);

        readFileSync
          .withArgs("/home/dir/.bashrc")
          .returns(`<prefix>${content}<suffix>`);

        FindAliasInstaller.install();

        copyFileSync.firstCall.args.should.be.deep.equal([
          ".find-alias.sh",
          "/home/dir/.find-alias.sh",
        ]);
        sinon.assert.notCalled(appendFileSync);

        verifyLogs(
          consoleStub,
          "Installing find-alias",
          "Already installed for bash",
          "Skipping installing on zsh as no .zshrc file were found in your home directory",
          "Find-alias is installed, restart your terminal and type: fa to use it"
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
          content,
        ]);
        appendFileSync.secondCall.args.should.be.deep.equal([
          "/home/dir/.zshrc",
          content,
        ]);
        verifyLogs(
          consoleStub,
          "Installing find-alias",
          "Installed for bash",
          "Please either restart the terminal or in bash shell execute: source ~/.bashrc",
          "Then type fa to use find-alias",
          "Installed for zsh",
          "Please either restart the terminal or in zsh shell execute: source ~/.zshrc",
          "Then type fa to use find-alias",
          "Find-alias is installed, restart your terminal and type: fa to use it"
        );
      });
    });
    describe("and it is a reinstall", () => {
      it("should copy .find-alias.sh, and skip setting up .bashrc file ans skip zsh", () => {
        existsSync.withArgs("/home/dir/.bashrc").returns(true);
        existsSync.withArgs("/home/dir/.zshrc").returns(true);

        readFileSync
          .withArgs("/home/dir/.bashrc")
          .returns(`<prefix>${content}<suffix>`);
        readFileSync
          .withArgs("/home/dir/.zshrc")
          .returns(`<prefix>${content}<suffix>`);

        FindAliasInstaller.install();

        copyFileSync.firstCall.args.should.be.deep.equal([
          ".find-alias.sh",
          "/home/dir/.find-alias.sh",
        ]);
        sinon.assert.notCalled(appendFileSync);

        verifyLogs(
          consoleStub,
          "Installing find-alias",
          "Already installed for bash",
          "Already installed for zsh",
          "Find-alias is installed, restart your terminal and type: fa to use it"
        );
      });
    });
  });
});
